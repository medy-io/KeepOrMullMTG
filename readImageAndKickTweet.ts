export function readImageAndKickTweet() {
    compileHandPath = path.join(__dirname, '/img/' + 'compileHand.jpg');
    fs.readFile(compileHandPath, { encoding: 'base64', flag: 'r' }, (err, data) => {
        if (err) return err;
        console.log('Build complete!');
        b64content = data;
        postToTwitter();
    });
}