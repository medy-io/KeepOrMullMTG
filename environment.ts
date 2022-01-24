import Twit from "twit";

export const TWITTER_KEYS: any = new Twit(
    {
        consumer_key: "9amG0HeJpVxYm5PCSzQM2Kd98", //process.env.BOT_CONSUMER_KEY,
        consumer_secret: "PHSiSWPQJ6kfrj8npKiquWlBinOO6yH8IIaSYWG4wrXLI3pvbV", //process.env.BOT_CONSUMER_SECRET,
        access_token: "1004735994552299520-zOn0vy1cPxylLeWRNyal0tliVcxUR5", //process.env.BOT_ACCESS_TOKEN,
        access_token_secret: "cPwS5ZGw3JX8G6uYlISwgvxLbuQncqHbqMe9nWmvo1Rhe" //process.env.BOT_ACCESS_TOKEN_SECRET
    }
);

// consumer_key: process.env.BOT_CONSUMER_KEY,
// consumer_secret: process.env.BOT_CONSUMER_SECRET,
// access_token: process.env.BOT_ACCESS_TOKEN,
// access_token_secret: process.env.BOT_ACCESS_TOKEN_SECRET