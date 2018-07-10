let twit = require('twit');
let config = require('./config.js');
let mtgTop8 = require('mtgtop8');
let fs = require('fs');
let mtgApi = require('mtgsdk')
let url = require('url');
let http = require('http')
let req = require('request');
let cheerio = require('cheerio');
let iconv = require('iconv-lite');
var Tweet = require('twitter-node-client').Twitter;
var mergeImg = require('merge-img');
var path = require("path");

var Twitter = new twit(config);
//Callback functions
// let error = function (err, response, body) {
//     console.log('ERROR [%s]', err);
// };
// let success = function (data) {
//     console.log('Data [%s]', data);
// };
let tweet = new Tweet(config);

let handSize = 7;

var download = function (uri, filename, callback) {
    // setTimeout(
    req.head(uri, function (err, res, body) {
        req(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
};

var b64content;
/**
 * Modern Combo IDs
 * a=392, valakut
 * a=191, creature tool box
 * a=184, storm
 * a=566, elves <3
 * a=775, KCI
 * a=233, Living End
 * a=275, Dredge
 * a=355, Ad Nauseam
 * a=196, Infect
 * a=348, Amulet Titan
 */
let vintageComboIDs = [30, 661, 28, 156, 562, 67];
let legacyComboIDs = [555, 32, 38, 35, 33, 21, 98, 368, 82, 83, 385, 87, 130, 563];
let modernComboIDs = [392, 191, 184, 566, 775, 233, 275, 355, 196, 348];
let formatList = ['MO', 'LE', 'VI'];
let randomDeckArchType;
let chooseFormat = formatList[Math.floor(Math.random() * formatList.length)];
let playOrDraw;
let deckLink = 'http://mtgtop8.com/';
let deckName;
console.log(chooseFormat);
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

console.log(randomDeckArchType);
let mtgTop8Modern = 'http://mtgtop8.com/archetype?a=' + randomDeckArchType + '&meta=51&f=' + chooseFormat + '';
console.log(mtgTop8Modern);
req.post(mtgTop8Modern, function (err, res) {
    if (err) return callback(err);
    // console.log(res);
    let result = [];
    let $ = cheerio.load(iconv.decode(res.body, 'latin-1'));
    // console.log('MONEY SHOT%%%%%%' + $);
    let table = $('div > div > table > tbody > tr > td > form > table[width="99%"]').eq(0);
    // console.log('Table ' + table);
    $('tr[class="hover_tr"]', table).each(function (i, div) {
        // console.log('DIV ' + div);
        let link = $('td a', div).attr('href');
        // console.log('LOG #######' + link);
        // let date = $('td[align="right"]', div).text();
        result.push({
            link: link
        });
        let ind = 0;
        console.log('LINKY LINK: ' + result[ind].link);
        ind++;
        deckLink = deckLink + result[i].link;
    });
    // console.log('This is Link: ' + result.length);
    let randomDeckLink = result[Math.floor(Math.random() * result.length)];
    console.log('RANDO LINK: ' + randomDeckLink);
    // console.log(randomDeckLink);
    let eventID = randomDeckLink.link.match(/\d+/);
    // console.log('DECK ID +++++++++++' + deckID);
    let deckID = randomDeckLink.link.match(/d=\d+/);
    deckID = deckID[0].substring(2);
    // console.log('DECK ID +++++++++++' + eventID);
    console.log('EVENT ID }}}}}}}}}}}}}}}' + eventID);
    mtgTop8.eventInfo(eventID, function (err, event) {
        console.log('EVENT }}}}}}}}}}}}}}}' + event);
        let listOfDecksFromEvents = event.decks;
        console.log(listOfDecksFromEvents);
        console.log('deckID: ' + deckID);
        console.log('eventID: ' + eventID);
        for (let i = 0; i < listOfDecksFromEvents.length; i++) {
            if (listOfDecksFromEvents[i].id == deckID) {

                console.log(listOfDecksFromEvents[i].title);
                deckName = listOfDecksFromEvents[i].title;
            }
        }
        

        mtgTop8.deck(eventID, deckID, function (err, deck) {
            // console.log(deck);
            let deckList = deck;
            let deckHand = [];
            let card;
            for (let i = 0; i < handSize; i++) {
                card = { name: deck.cards[Math.floor(Math.random() * deck.cards.length)].name };
                deckHand.push(card);
            }
            for (let i = 0; i < deckHand.length; i++) {
                let dest = 'https://api.scryfall.com/cards/named?exact=' + deckHand[i].name + ';format=image;version=normal';
                console.log(dest);
                download(dest, './img/magicCard' + i + '.jpg', function () {
                    // mergeImg(['./img/magicCard' + i + '.jpg'])
                    // .then((img) => {
                    //     // Save image as file
                    //     img.write('compileHand.jpg', () => console.log('done'));
                    // });
                    console.log('done');
                });
            }
            var compileHandPath;
            // fs.unlink(path.join(__dirname, '') + '/compileHand.jpg');
            mergeImg(['./img/magicCard0.jpg', './img/magicCard1.jpg', './img/magicCard2.jpg', './img/magicCard3.jpg', './img/magicCard4.jpg',
                './img/magicCard5.jpg', './img/magicCard6.jpg'])
                .then((img) => {
                    // Save image as file
                    img.write('compileHand.jpg', () => console.log('done'));
                });
            // compileHandPath = path.join(__dirname, '') + '/compileHand.jpg';
            // b64content = fs.readFileSync(compileHandPath, { encoding: 'base64' });

            // Twitter.post('media/upload', { media_data: b64content }, function (err, data, response) {
            //     if (err) {
            //         console.log('ERROR:');
            //         console.log(err);
            //     }
            //     else {
            //         console.log('Image uploaded!');
            //         console.log('Now tweeting it...');

            //         Twitter.post('statuses/update', {
            //             status: 'Deck: ' + deckName + '\n' + 'On the ' + playOrDraw + '\n' + 'Format: ' + chooseFormat + '\n' + 'Deck list: ' + deckLink,
            //             media_ids: new Array(data.media_id_string)
            //         },
            //             function (err, data, response) {
            //                 if (err) {
            //                     console.log('ERROR:');
            //                     console.log(err);
            //                 }
            //                 else {
            //                     console.log('Posted an image!');
            //                 }
            //             }
            //         );
            //     }
            // });
        });
    });

});
