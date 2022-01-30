import request from "request";
import cheerio from "cheerio";
import moment from "moment";
import { createDataUrl } from "./createMTGTop8Url";

// async fetch for mtg events data for a particular format
export async function fetchData(tweetProperties: any) {
    const URL_OBJ: any = createDataUrl();
    await request(URL_OBJ.MTG_GOLDFISH_URL, (error, response, html) => {
        if (!error && response.statusCode == 200) {
            const $ = cheerio.load(html);
            let archetypeList: any[] = [];
            let archetype: any;
            $('.archetype-tile-container .deck-price-paper > a').each((i, element) => {
                archetypeList.push($(element).text());
            });
            // randomly choose archetype
            archetype = randomlyChooseDeckArchetype(archetypeList);
            let archetypeName: any = $('.deck-price-paper > a');
            let archetypeLink: any = $('.deck-price-paper > a').attr('href');
            tweetProperties.deckName = archetypeName.html(); // gets me the name of the deck
            tweetProperties.deckLink = "https://www.mtggoldfish.com/" + archetypeLink; // gets me the archetype link
            tweetProperties.format = URL_OBJ.FORMAT; // gets me the format name
            getArchetypeDeckData(archetypeLink);
        }
    });
};

function randomlyChooseDeckArchetype(lists: any) {
    return lists[Math.floor(Math.random() * lists.length)];
}

function getArchetypeDeckData(link): any {
    request("https://www.mtggoldfish.com/" + link, (error, response, html) => {
        if (!error && response.statusCode == 200) {
            const $ = cheerio.load(html);
            const deckList = $('.deck-view-deck-table > tbody');
        }
    });
}
