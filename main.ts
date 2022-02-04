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
        let va: any = await fetchData().then(val => console.log(val));
        // eventId = eventData[Math.floor(Math.random() * eventData.length)].id;
        // singleEventDataPoint = await fetchData.fetchSingleEventData(eventId);
        // deckObj = singleEventDataPoint.decks[Math.floor(Math.random() * singleEventDataPoint.decks.length)];
        // await createCardImageURL(await convertDeckDataToReflectMultipleCopies(await fetchData.fetchDeck(eventId, deckObj.id)));
        // await downloadImages();
    } catch (error) {
        console.log("Something went wrong:  |  " + error);
        throw "ERROR:   " + error;
    }
})()

// mergeAllImages();
// mergeImageFlag = 0;

