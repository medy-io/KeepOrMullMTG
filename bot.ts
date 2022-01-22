// imports
import { keys } from "./environment.ts";
import { postToTwitter } from "./postToTwiter";

const Twit = require('twit'),
    Twitter = new Twit(
        {
            keys.consumer_key,
            keys.consumer_secret,
            keys.access_token,
            keys.access_token_secret
        }
    ),
    request = require('request'),
    mergeImg = require('merge-img'),
    path = require("path"),
    fs = require('fs'),
    fetchMtgData = require('./fetchData'),
    globalConst = require('./global-constants');

// variables
let b64content,
    chooseFormat,
    eventData,
    singleEventDataPoint,
    compileHandPath,
    deckObj = [],
    card = [],
    dest = [],
    eventId,
    mergeImageFlag = 0;;

// get mtg, get images, merge image and tweet: 'bootstrap async function for bot'
(async () => {
    try {
        eventData = await fetchMtgData.retrieveMTGEventsData(1);
        console.log("event data: " + eventData);
        eventId = eventData[Math.floor(Math.random() * eventData.length)].id;
        singleEventDataPoint = await fetchMtgData.fetchSingleEventData(eventId);
        deckObj = singleEventDataPoint.decks[Math.floor(Math.random() * singleEventDataPoint.decks.length)];
        await createCardImageURL(await convertDeckDataToReflectMultipleCopies(await fetchMtgData.fetchDeck(eventId, deckObj.id)));
        await downloadImages();
    } catch (error) {
        console.log("Something went wrong:  |  " + error)
    }
})()

// format deck data to include multiple copies of certain cards
const convertDeckDataToReflectMultipleCopies = deckData => {
    let deck = [];
    for (let i = 0; i < deckData.cards.length; i++) {
        if (deckData.cards[i] && deckData.cards[i].count && deckData.cards[i].name) {
            var cardCount = deckData.cards[i].count;
            var cardName = deckData.cards[i].name;
            for (let i = 0; i < cardCount; i++) {
                deck.push(cardName);
            }
        }
    }
    return deck;
}

// create list of card image urls
const createCardImageURL = deckData => {
    for (var i = 0; i < globalConst.HAND_SIZE; i++) {
        var cardIndex = Math.floor(Math.random() * deckData.length);
        let chosenCard = deckData.splice(cardIndex, 1)[0];
        card.push(chosenCard);
        dest.push('https://api.scryfall.com/cards/named?exact=' + card[i] + ';format=image;version=normal');
    }
}

const downloadCardImage = index => {
    request(dest[index])
        .pipe(fs.createWriteStream('./img/magicCard' + index + '.jpg'))
        .on('close', function () {
            console.log('finished download');
            mergeImageFlag++;
            if (mergeImageFlag === 7) {
                console.log(mergeImageFlag);
                mergeAllImages();
            }
        });
}

// download each card image and wait for all card image promises to resolve, then call mergeImages()
const downloadImages = () => {
    try {
        let pList = [];
        for (let i = 0; i < 7; i++) {
            pList.push(request.head(dest[i]));
        }
        Promise.all(pList).then(() => {
            for (let i = 0; i < 7; i++) {
                downloadCardImage(i);
            }
        });
    } catch (err) {
        console.log(err);
    }
}

// merge all card images, save file, convert to base64 image, then initiate tweet
const mergeAllImages = () => {
    mergeImageFlag = 0;
    mergeImg(['./img/magicCard0.jpg', './img/magicCard1.jpg', './img/magicCard2.jpg', './img/magicCard3.jpg', './img/magicCard4.jpg',
        './img/magicCard5.jpg', './img/magicCard6.jpg'])
        .then(img => {
            if (img) {
                // Save image as file
                img.write('./img/compileHand.jpg', () => {
                    console.log('merged');
                    readImageAndKickTweet();
                });
            }
        });
}

const readImageAndKickTweet = () => {
    compileHandPath = path.join(__dirname, '/img/' + 'compileHand.jpg');
    fs.readFile(compileHandPath, { encoding: 'base64', flag: 'r' }, (err, data) => {
        if (err) return err;
        console.log('Build complete!');
        b64content = data;
        postToTwitter();
    });
}