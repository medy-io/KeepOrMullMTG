const request = require('request'),
    cheerio = require('cheerio'),
    iconv = require('iconv-lite'),
    moment = require('moment');

// async fetch for mtg events data for a particular format
function retrieveMTGEventsData(page) {
    return new Promise(function (resolve, reject) {
        var formatList = ['ST', 'PI', 'MO', 'LE', 'VI'];
        chooseFormat = formatList[Math.floor(Math.random() * formatList.length)];
        var mtgTop8URL = 'http://mtgtop8.com/format?f=' + chooseFormat + '&meta=52';
        request.post(mtgTop8URL, { form: { cp: page } }, function (error, response) {
            if (error) return reject(error);
            var result = [];
            var $ = cheerio.load(iconv.decode(response.body, 'latin-1'));
            var table = $('div div table tr td[width="40%"] > table').eq(1);
            $('tr[height="30"]', table).each(function (i, div) {
                var link = $('td a', div).attr('href');
                var date = $('td[align="right"]', div).text();
                result.push({
                    title: $('td a', div).text(),
                    id: parseInt(link.match(/e\=(\d*)/)[1]),
                    stars: $('td[width="15%"] img[src="graph/star.png"]', div).length,
                    bigstars: $('td[width="15%"] img[src="graph/bigstar.png"]', div).length,
                    date: moment(date, 'DD/MM/YY').toDate()
                });
            });
            resolve(result);
        });
    });
}

function fetchSingleEventData(eventId) {
    return new Promise(function (resolve, reject) {
        request('http://mtgtop8.com/event?e=' + eventId, function (err, res) {
            if (err) return reject(err);
            var $ = cheerio.load(iconv.decode(res.body, 'latin-1'));
            var players;
            var date;
            var data = $('table div table td[align=center] div')[1].prev.data.trim();
            var playersRE = /^(\d*) players/;
            var dateRE = /(\d\d\/\d\d\/\d\d)$/;
            if (data.match(playersRE)) players = parseInt(data.match(playersRE)[1]);
            if (data.match(dateRE)) date = data.match(dateRE)[1];
            var result = {
                title: $('.w_title td').first().text(),
                format: $('table div table td[align=center] div')[0].prev.data.trim(),
                stars: $('table div table td[align=center] div img[src="graph/star.png"]').length,
                bigstars: $('table div table td[align=center] div img[src="graph/bigstar.png"]').length,
                players: players,
                date: moment(date, 'DD/MM/YY').toDate(),
                decks: []
            };
            $('table td[width="25%"] > div > div:not([align="center"])').each(function (i, div) {
                var link = $($('div div a', div)[0]).attr('href');
                result.decks.push({
                    result: $('div div[align=center]', div).text().trim(),
                    title: $($('div div a', div)[0]).text().trim(),
                    player: $($('div div a', div)[1]).text().trim(),
                    id: parseInt(link.match(/\&d\=(\d*)/)[1])
                });
            });
            result.players = result.players || result.decks.length;
            resolve(result);
        });
    });
}

function fetchDeck(eventId, deckId) {
    return new Promise(function (resolve, reject) {
        request('http://mtgtop8.com/event?e=' + eventId + '&d=' + deckId, function (err, res) {
            if (err) return reject(err);
            var $ = cheerio.load(iconv.decode(res.body, 'latin-1'));
            var result = {
                player: $('table .chosen_tr [align=right] .topic').text().trim(),
                result: $('table .chosen_tr [align=center]').text().trim(),
                cards: [],
                sideboard: []
            };
            var addCards = function (arr) {
                return function (i, card) {
                    var parent = $(card).parent();
                    $(card).remove();

                    var name = $(card).text().trim();
                    var count = parseInt($(parent).text().trim());
                    arr.push({
                        count: count,
                        name: name
                    });
                };
            };
            var tables = $('table table table');
            $('tr td div span', tables.last()).each(addCards(result.sideboard));
            tables.slice(0, -1).each(function (i, table) {
                $('tr td div span', table).each(addCards(result.cards));
            });
            // An check to make sure that it's being noticed if a deck is empty. Not too sure that the method above is always working for older data.
            if (!result.cards.length) console.log('[mtgtop8] It appears that this deck is empty, should be investigated. .event(' + eventId + ',' + deckId + ')');
            resolve(result);
        });
    });
}

module.exports.retrieveMTGEventsData = retrieveMTGEventsData;
module.exports.fetchSingleEventData = fetchSingleEventData;
module.exports.fetchDeck = fetchDeck;