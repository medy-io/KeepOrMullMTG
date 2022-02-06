// dependencies
import Twit from "twit";
import { TWITTER_KEYS } from "./environment";
import request from "request";
import mergeImg from "merge-img";
import path from "path";
import fs from "fs";
import { fetchData } from "./fetchData";
import { CONSTANTS } from "./globalConstants";
// functions
import { mergeAllImages } from "./mergeAllImages";
import { readImageAndKickTweet } from "./readImageAndKickTweet";
import { postToTwitter } from "./postToTwiter";
import cheerio from "cheerio";
import axios from 'axios';
import { createDataUrl } from "./createMTGTop8Url";
import { randomlyChooseDeckArchetype } from "./randomlyChooseDeckArchetype";

interface TweetProperties {
    deckName: string;
    deckLink: string;
    format: string;
}

// variables
let b64content: any,
    chooseFormat: any,
    eventData: any,
    singleEventDataPoint: any,
    compileHandPath: any,
    deckObj: any[] = [],
    card: any[] = [],
    dest: any[] = [],
    eventId: any,
    mergeImageFlag: number = 0;




// get mtg, get images, merge image and tweet: 'bootstrap async function for bot'
(async () => {
    try {
        const URL_OBJ: any = createDataUrl();
        const resp: any = axios.get(URL_OBJ.MTG_GOLDFISH_URL);
        let ans: any = await resp.then(response => {
            const $ = cheerio.load(response.data);
            let tweetProperties: any = { deckName: '', deckLink: '', format: '', deckList: ''};
            let archetypeList: any[] = [];
            let urlList: any[] = [];
            let archetype: any;
            $('.archetype-tile-container .deck-price-paper > a').each((i, element) => {
                archetypeList.push($(element).text());
                urlList.push($(element).attr('href'));
            });
            // randomly choose archetype
            archetype = randomlyChooseDeckArchetype(archetypeList);
            let thingy: any = urlList.find(val => val.includes(archetype.split(' ')[0].toLowerCase()));
            tweetProperties.deckName = archetype; // gets me the name of the deck
            tweetProperties.deckLink = "https://www.mtggoldfish.com" + thingy; // gets me the archetype link
            tweetProperties.format = URL_OBJ.FORMAT; // gets me the format name
            tweetProperties.deckList = getArchetypeDeckData(tweetProperties.deckLink);
            tweetProperties.deckList = tweetProperties.deckList.then(resp => {
                const $ = cheerio.load(resp.data);
                let list: any = $('.deck-view-deck-table > tbody');
                console.log("list   " + list);
                return list;
            });
            // return tweetProperties;
            return tweetProperties;
        });
        console.log(ans);
        /**
            deckName: 'Jund',
            deckLink: 'https://www.mtggoldfish.com/archetype/jund#paper',
            format: 'modern',
            deckList: ''
         */
        // step 1 create random hand
        // createCardImageURL(ans.deckList);
        // step 2 fetch card images via scryfall
        // downloadImages();

        // eventId = eventData[Math.floor(Math.random() * eventData.length)].id;
        // singleEventDataPoint = await fetchData.fetchSingleEventData(eventId);
        // deckObj = singleEventDataPoint.decks[Math.floor(Math.random() * singleEventDataPoint.decks.length)];
        // await fetchData.fetchDeck(eventId, deckObj.id
        // await createCardImageURL(await convertDeckDataToReflectMultipleCopies()));
        // await downloadImages();
        // mergeAllImages();
        // mergeImageFlag = 0;
    } catch (error) {
        console.log("Something went wrong:  |  " + error);
        throw "ERROR:   " + error;
    }
})()


async function getArchetypeDeckData(link) {
    return axios.get(link);
}


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

// // create list of card image urls
// const createCardImageURL = deckData => {
//     for (var i = 0; i < globalConst.HAND_SIZE; i++) {
//         var cardIndex = Math.floor(Math.random() * deckData.length);
//         let chosenCard = deckData.splice(cardIndex, 1)[0];
//         card.push(chosenCard);
//         dest.push('https://api.scryfall.com/cards/named?exact=' + card[i] + ';format=image;version=normal');
//     }
// }

// const downloadCardImage = index => {
//     request(dest[index])
//         .pipe(fs.createWriteStream('./img/magicCard' + index + '.jpg'))
//         .on('close', function () {
//             console.log('finished download');
//             mergeImageFlag++;
//             if (mergeImageFlag === 7) {
//                 console.log(mergeImageFlag);
//                 mergeAllImages();
//             }
//         });
// }

// // download each card image and wait for all card image promises to resolve, then call mergeImages()
// const downloadImages = () => {
//     try {
//         let pList = [];
//         for (let i = 0; i < 7; i++) {
//             pList.push(request.head(dest[i]));
//         }
//         Promise.all(pList).then(() => {
//             for (let i = 0; i < 7; i++) {
//                 downloadCardImage(i);
//             }
//         });
//     } catch (err) {
//         console.log(err);
//     }
// }

// // merge all card images, save file, convert to base64 image, then initiate tweet
// const mergeAllImages = () => {
//     mergeImageFlag = 0;
//     mergeImg(['./img/magicCard0.jpg', './img/magicCard1.jpg', './img/magicCard2.jpg', './img/magicCard3.jpg', './img/magicCard4.jpg',
//         './img/magicCard5.jpg', './img/magicCard6.jpg'])
//         .then(img => {
//             if (img) {
//                 // Save image as file
//                 img.write('./img/compileHand.jpg', () => {
//                     console.log('merged');
//                     readImageAndKickTweet();
//                 });
//             }
//         });
// }

// const readImageAndKickTweet = () => {
//     compileHandPath = path.join(__dirname, '/img/' + 'compileHand.jpg');
//     fs.readFile(compileHandPath, { encoding: 'base64', flag: 'r' }, (err, data) => {
//         if (err) return err;
//         console.log('Build complete!');
//         b64content = data;
//         postToTwitter();
//     });
// }

// // post tweet with image and deck data
// const postToTwitter = () => {
//     Twitter.post('media/upload', { media_data: b64content }, function (err, data, response) {
//         if (err) {
//             console.log('ERROR:');
//             console.log(err);
//         } else {
//             console.log('Image uploaded!');
//             console.log('Now tweeting it...');

//             Twitter.post('statuses/update', {
//                 status: 'Deck: ' + deckObj.title + '\n' + 'On the ' + globalConst.PLAY_OR_DRAW + '\n' + 'Format: ' + singleEventDataPoint.format + '\n' + 'Deck list: ' + globalConst.DECK_LINK + eventId + '&d=' + deckObj.id + '&f=' + chooseFormat + '\n' + '#KeepOrMull' + '\n' + '#MTG' + singleEventDataPoint.format + '\n' + '#MTG',
//                 media_ids: new Array(data.media_id_string)
//             },
//                 (err, data, response) => {
//                     if (err) {
//                         console.log('ERROR:');
//                         console.log(err);
//                     } else {
//                         console.log('Posted an image!');
//                     }
//                 }
//             );
//         }
//     });
// }


