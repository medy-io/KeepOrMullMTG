// imports
var twit = require('twit'),
    config = require('./config.js'),
    request = require('request'),
    mergeImg = require('merge-img'),
    path = require("path"),
    Twitter = new twit(config),
    fs = require('fs'),
    fetchMtgData = require('./fetch-mtg-data');


// variables
var handSize = 7,
    // play or draw for tweet
    playOrDraw = Math.floor(Math.random()) % 2 ? 'Play' : 'Draw',
    b64content,
    deckName,
    chooseFormat,
    eventData,
    singleEventDataPoint,
    deckLink,
    compileHandPath,
    deck = [];

// Async and await
async function getSampleHandData() {
    try {
        eventData = await fetchMtgData.retrieveMTGEventsData(1);
        var eventId = eventData[Math.floor(Math.random() * eventData.length)].id;
        singleEventDataPoint = await fetchMtgData.fetchSingleEventData(eventId);
        var deck = singleEventDataPoint.decks[Math.floor(Math.random() * singleEventDataPoint.decks.length)];
        // assign chosen format for tweet
        chooseFormat = singleEventDataPoint.format;
        // assign deck name for tweet
        deckName = deck.title;
        var deckData = await fetchMtgData.fetchDeck(eventId, deck.id);
        // create deck link for tweet
        deckLink = 'https://www.mtgtop8.com/event?e=' + eventId + '&d=' + deck.id + '&f=' + chooseFormat;
        await fetchCardImageURL(deckData);
        // await postToTwitter();
    } catch (error) {
        console.log(error);
    }
}

function convertDeckDataToReflectDuplicates(deckData) {
    var cardArrayNumber = [];
    cardArrayNumber = deckData.cards;
    for (let i = 0; i < cardArrayNumber.length; i++) {
        if (cardArrayNumber[i] && cardArrayNumber[i].count && cardArrayNumber[i].name) {
            var cardCount = cardArrayNumber[i].count;
            var cardName = cardArrayNumber[i].name;
            for (let i = 0; i < cardCount; i++) {
                deck.push(cardName);
            }
        }
    }
    return deck;
}

var download = function (uri, filename, callback) {
    request.head(uri, function (err, res, body) {
        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
};

function fetchCardImageURL(deckData) {
    return new Promise(function (resolve, reject) {
        var promiseArray = [];
        var deck = convertDeckDataToReflectDuplicates(deckData);
        for (var i = 0; i < handSize; i++) {
            var card = { name: deck[Math.floor(Math.random() * deck.length)] };
            var dest = 'https://api.scryfall.com/cards/named?exact=' + card.name + ';format=image;version=normal';
            promiseArray.push(new Promise(function (resolve, reject) {
                download(dest, './img/magicCard' + i + '.jpg', function () {
                    console.log('finished download');
                    resolve();
                });
            }));
        }
        Promise.all(promiseArray).then(() => {
            mergeImg(['./img/magicCard0.jpg', './img/magicCard1.jpg', './img/magicCard2.jpg', './img/magicCard3.jpg', './img/magicCard4.jpg',
                './img/magicCard5.jpg', './img/magicCard6.jpg'])
                .then(img => {
                    // Save image as file
                    img.write('./img/compileHand.jpg', () => console.log('merged'));
                    compileHandPath = path.join(__dirname, '/img/' + 'compileHand.jpg');
                    console.log(compileHandPath);
                    fs.readFile(compileHandPath, { encoding: 'base64', flag: 'r' }, (err, data) => {
                        if (err) return err;
                        console.log('B64 AFTER readFile');
                        console.log('------------------');
                        console.log(data);
                        b64content = data;
                        postToTwitter();
                    });
                });
        }).catch(error => {
            console.log('Error: ' + error);
        });
        resolve();
    });
}

function postToTwitter() {
    console.log('BEFORE TWITTER POST');
    console.log(b64content);
    Twitter.post('media/upload', { media_data: b64content }, function (err, data, response) {
        if (err) {
            console.log('ERROR:');
            console.log(err);
        }
        else {
            console.log('Image uploaded!');
            console.log('Now tweeting it...');

            Twitter.post('statuses/update', {
                status: 'Deck: ' + deckName + '\n' + 'On the ' + playOrDraw + '\n' + 'Format: ' + chooseFormat + '\n' + 'Deck list: ' + deckLink,
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
getSampleHandData();