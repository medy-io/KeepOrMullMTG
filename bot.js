var twit = require('twit');
var config = require('./config.js');
var mtgTop8 = require('mtgtop8');
var fs = require('fs');
var req = require('request');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');
var mergeImg = require('merge-img');
var path = require("path");
var Twitter = new twit(config);

var download = function (uri, filename, callback) {
    // setTimeout(
    req.head(uri, function (err, res, body) {
        req(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
};

var randomDeckArchType;
var deckName;
var playOrDraw;
var b64content;
var handSize = 7;
var deckLink = 'http://mtgtop8.com/';
var vintageComboIDs = [30, 661, 28, 156, 562, 67];
var legacyComboIDs = [555, 32, 38, 35, 33, 21, 98, 368, 82, 83, 385, 87, 130, 563];
var modernComboIDs = [392, 191, 184, 566, 775, 233, 275, 355, 196, 348];
var formatList = ['MO', 'LE', 'VI'];
var chooseFormat = formatList[Math.floor(Math.random() * formatList.length)];

if (chooseFormat === 'MO') {
    chooseFormat = 'Modern';
    // choose modern combo
    randomDeckArchType = modernComboIDs[Math.floor(Math.random() * modernComboIDs.length)];
} else if (chooseFormat === 'LE') {
    chooseFormat = 'Legacy';
    // legacy combo
    randomDeckArchType = legacyComboIDs[Math.floor(Math.random() * legacyComboIDs.length)];
} else if (chooseFormat === 'VI') {
    chooseFormat = 'Vintage';
    // vintage combo
    randomDeckArchType = vintageComboIDs[Math.floor(Math.random() * vintageComboIDs.length)];
}
if (randomDeckArchType % 2) {
    playOrDraw = 'Play';
} else {
    playOrDraw = 'Draw';
}
var mtgTop8Modern = 'http://mtgtop8.com/archetype?a=' + randomDeckArchType + '&meta=51&f=' + chooseFormat + '';
req.post(mtgTop8Modern, function (err, res) {
    if (err) return callback(err);
    let result = [];
    let $ = cheerio.load(iconv.decode(res.body, 'latin-1'));
    let table = $('div > div > table > tbody > tr > td > form > table[width="99%"]').eq(0);
    $('tr[class="hover_tr"]', table).each(function (i, div) {
        let link = $('td a', div).attr('href');
        result.push({
            link: link
        });
        let ind = 0;
        ind++;
        deckLink = deckLink + result[i].link;
    });
    let randomDeckLink = result[Math.floor(Math.random() * result.length)];
    let eventID = randomDeckLink.link.match(/\d+/);
    let deckID = randomDeckLink.link.match(/d=\d+/);
    deckID = deckID[0].substring(2);
    mtgTop8.eventInfo(eventID, function (err, event) {
        let listOfDecksFromEvents = event.decks;
        console.log('deckID: ' + deckID);
        console.log('eventID: ' + eventID);
        for (let i = 0; i < listOfDecksFromEvents.length; i++) {
            if (listOfDecksFromEvents[i].id == deckID) {
                console.log(listOfDecksFromEvents[i].title);
                deckName = listOfDecksFromEvents[i].title;
            }
        }
        mtgTop8.deck(eventID, deckID, function (err, deck) {
            if (deck) {
                let card;
                for (let i = 0; i < handSize; i++) {
                    card = { name: deck.cards[Math.floor(Math.random() * deck.cards.length)].name };
                    let dest = 'https://api.scryfall.com/cards/named?exact=' + card.name + ';format=image;version=normal';
                    console.log('Link: ' + dest);
                    download(dest, './img/magicCard' + i + '.jpg', function () {
                        console.log('finished download');
                    });
                }
                setTimeout(function () {
                    mergeImg(['./img/magicCard0.jpg', './img/magicCard1.jpg', './img/magicCard2.jpg', './img/magicCard3.jpg', './img/magicCard4.jpg',
                        './img/magicCard5.jpg', './img/magicCard6.jpg'])
                        .then((img) => {
                            // Save image as file
                            img.write('compileHand.jpg', () => console.log('merged'));
                        });
                    setTimeout(function () {
                        var compileHandPath;
                        compileHandPath = path.join(__dirname, '') + '/compileHand.jpg';
                        b64content = fs.readFileSync(compileHandPath, { encoding: 'base64' });
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
                    }, 3000)
                }, 6000)
            }
        });
    });
});
