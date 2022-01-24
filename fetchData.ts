import request from "request";
import cheerio from "cheerio";
import moment from "moment";
import { createDataUrl } from "./createMTGTop8Url";

// async fetch for mtg events data for a particular format
export async function fetchData(page?: any) {
    const URL_OBJ: any = createDataUrl();
    let tweetProperties: any = { deckName: '', deckLink: '', format: ''};
    await request(URL_OBJ.MTG_GOLDFISH_URL, (error, response, html) => {
        if (!error && response.statusCode == 200) {
            const $ = cheerio.load(html);
            let archetypeList: any;
            let archetype: any;
            $('.archetype-tile-container .deck-price-paper > a').each((i, element) => {
                archetypeList = $(element).text();
            });
            // randomly choose archetype
            archetype = randomlyChooseDeckArchetype(archetypeList);
            // console.log(archetype);
            let archetypeName: any = $('.deck-price-paper > a');
            let archetypeLink: any = $('.deck-price-paper > a').attr('href');
            tweetProperties.deckName = archetypeName.html(); // gets me the name of the deck
            tweetProperties.deckLink = "https://www.mtggoldfish.com/" + archetypeLink; // gets me the archetype link
            tweetProperties.format = URL_OBJ.FORMAT; // gets me the format name
            getArchetypeDeckData(archetypeLink);
        }
    });
    console.log(tweetProperties);
    return tweetProperties;
};

function randomlyChooseDeckArchetype(lists: any) {
    console.log(lists);
    // console.log(lists.trim().split(/\r?\n/));
    return lists[Math.floor(Math.random() * lists.length)];
}

function getArchetypeDeckData(link): any {
    request("https://www.mtggoldfish.com/" + link, (error, response, html) => {
        if (!error && response.statusCode == 200) {
            const $ = cheerio.load(html);
            const deckList = $('.deck-view-deck-table > tbody');
            // console.log(deckList.text().trim().replace(/(\r\n|\n|\r|\s+)/gm, " "));
        }
    });
}
