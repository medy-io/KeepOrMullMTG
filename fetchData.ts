import { axios } from 'axios';
import cheerio from "cheerio";
import { createDataUrl } from "./createMTGTop8Url";
import { randomlyChooseDeckArchetype } from "./randomlyChooseDeckArchetype";

// async fetch for mtg events data for a particular format
export async function fetchData() {
    const URL_OBJ: any = createDataUrl();
    // let options = {
    //     uri: 'http://www.google.com',
    //     transform: function (body) {
    //         return cheerio.load(body);
    //     }
    // };

    // request(options).then($ => {
    //     console.log($);
    // });
};

// async function getArchetypeDeckData(link) {
//     return await request("https://www.mtggoldfish.com/" + link, (error, response, html) => {
//         if (!error && response.statusCode == 200) {
//             const $ = cheerio.load(html);
//             let list: any = $('.deck-view-deck-table > tbody');
//             return list;
//         }
//     });
// }


/** 
(error, response, html) => {
    if (!error && response.statusCode == 200) {
        const $ = cheerio.load(html);
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
        return tweetProperties;
    }
});

*/