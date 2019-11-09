// imports
var Twit = require('twit'),
    Twitter = new Twit(
        {
            consumer_key: '9amG0HeJpVxYm5PCSzQM2Kd98', //process.env.BOT_CONSUMER_KEY,
            consumer_secret: 'PHSiSWPQJ6kfrj8npKiquWlBinOO6yH8IIaSYWG4wrXLI3pvbV',// process.env.BOT_CONSUMER_SECRET,
            access_token: '1004735994552299520-zOn0vy1cPxylLeWRNyal0tliVcxUR5',// process.env.BOT_ACCESS_TOKEN,
            access_token_secret: 'cPwS5ZGw3JX8G6uYlISwgvxLbuQncqHbqMe9nWmvo1Rhe', // process.env.BOT_ACCESS_TOKEN_SECRET
        }
    ),
    request = require('request'),
    mergeImg = require('merge-img'),
    path = require("path"),
    fs = require('fs'),
    fetchMtgData = require('./fetchData');

// variables
var handSize = 7,
    // play or draw for tweet
    playOrDraw = Math.floor(Math.random() * 10 + 1) % 2 ? 'Play' : 'Draw',
    b64content,
    deckName,
    chooseFormat,
    eventData,
    singleEventDataPoint,
    deckLink = 'https://www.mtgtop8.com/event?e=',
    compileHandPath,
    deckObj = [],
    card = [],
    dest = [],
    eventId;

// get mtg, get images, merge image and tweet: 'bootstrap async function for bot'
async function getSampleHandData() {
    try {
        eventData = await fetchMtgData.retrieveMTGEventsData(1);
        eventId = eventData[Math.floor(Math.random() * eventData.length)].id;
        singleEventDataPoint = await fetchMtgData.fetchSingleEventData(eventId);
        deckObj = singleEventDataPoint.decks[Math.floor(Math.random() * singleEventDataPoint.decks.length)];
        createCardImageURL(convertDeckDataToReflectMultipleCopies(await fetchMtgData.fetchDeck(eventId, deckObj.id)));
        await downloadImages();
    } catch (error) {
        console.log(error);
    }
}
getSampleHandData();

// format deck data to include multiple copies of certain cards
function convertDeckDataToReflectMultipleCopies(deckData) {
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
function createCardImageURL(deckData) {
    for (var i = 0; i < handSize; i++) {
        var cardIndex = Math.floor(Math.random() * deckData.length);
        let chosenCard = deckData.splice(cardIndex, 1)[0];
        card.push(chosenCard);
        dest.push('https://api.scryfall.com/cards/named?exact=' + card[i] + ';format=image;version=normal');
    }
}

// download each card image and wait for all card image promises to resolve, then call margeImages()
function downloadImages() {
    var promise1 = new Promise(function (resolve, reject) {
        request.head(dest[0], (err, res, body) => {
            request(dest[0]).pipe(fs.createWriteStream('./img/magicCard' + 0 + '.jpg')).on('close', function () {
                console.log('finished download');
                resolve();
            });
        });
    });
    var promise2 = new Promise(function (resolve, reject) {
        request.head(dest[1], (err, res, body) => {
            request(dest[1]).pipe(fs.createWriteStream('./img/magicCard' + 1 + '.jpg')).on('close', function () {
                console.log('finished download');
                resolve();
            });
        });
    });
    var promise3 = new Promise(function (resolve, reject) {
        request.head(dest[2], (err, res, body) => {
            request(dest[2]).pipe(fs.createWriteStream('./img/magicCard' + 2 + '.jpg')).on('close', function () {
                console.log('finished download');
                resolve();
            });
        });
    });
    var promise4 = new Promise(function (resolve, reject) {
        request.head(dest[3], (err, res, body) => {
            request(dest[3]).pipe(fs.createWriteStream('./img/magicCard' + 3 + '.jpg')).on('close', function () {
                console.log('finished download');
                resolve();
            });
        });
    });
    var promise5 = new Promise(function (resolve, reject) {
        request.head(dest[4], (err, res, body) => {
            request(dest[4]).pipe(fs.createWriteStream('./img/magicCard' + 4 + '.jpg')).on('close', function () {
                console.log('finished download');
                resolve();
            });
        });
    });
    var promise6 = new Promise(function (resolve, reject) {
        request.head(dest[5], (err, res, body) => {
            request(dest[5]).pipe(fs.createWriteStream('./img/magicCard' + 5 + '.jpg')).on('close', function () {
                console.log('finished download');
                resolve();
            });
        });
    });
    var promise7 = new Promise(function (resolve, reject) {
        request.head(dest[6], (err, res, body) => {
            request(dest[6]).pipe(fs.createWriteStream('./img/magicCard' + 6 + '.jpg')).on('close', function () {
                console.log('finished download');
                resolve();
            });
        });
    });
    Promise.all([promise1, promise2, promise3, promise4, promise5, promise6, promise7]).then((values) => {
        console.log('Finished');
        mergeAllImages();
    });
}

// merge all card images, save file, convert to base64 image, then initiate tweet
function mergeAllImages() {
    mergeImg(['./img/magicCard0.jpg', './img/magicCard1.jpg', './img/magicCard2.jpg', './img/magicCard3.jpg', './img/magicCard4.jpg',
        './img/magicCard5.jpg', './img/magicCard6.jpg'])
        .then(img => {
            // Save image as file
            img.write('./img/compileHand.jpg', () => {
                console.log('merged');
            });
            compileHandPath = path.join(__dirname, '/img/' + 'compileHand.jpg');
            fs.readFile(compileHandPath, { encoding: 'base64', flag: 'r' }, (err, data) => {
                if (err) return err;
                console.log('Build complete!');
                b64content = data;
                postToTwitter();
            });
        });
}

// post tweet with image and deck data
function postToTwitter() {
    Twitter.post('media/upload', { media_data: b64content }, function (err, data, response) {
        if (err) {
            console.log('ERROR:');
            console.log(err);
        }
        else {
            console.log('Image uploaded!');
            console.log('Now tweeting it...');

            Twitter.post('statuses/update', {
                status: 'Deck: ' + deckObj.title + '\n' + 'On the ' + playOrDraw + '\n' + 'Format: ' + singleEventDataPoint.format + '\n' + 'Deck list: ' + deckLink + eventId + '&d=' + deckObj.id + '&f=' + chooseFormat + '\n' + '#KeepOrMull',
                media_ids: new Array(data.media_id_string)
            },
                function (err, data, response) {
                    if (err) {
                        console.log('ERROR:');
                        console.log(err);
                    }
                    else {
                        console.log('Posted an image!');
                    }
                }
            );
        }
    });
}
