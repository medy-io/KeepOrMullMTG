// merge all card images, save file, convert to base64 image, then initiate tweet
export function mergeAllImages() {
    mergeImg(['./img/magicCard0.jpg', './img/magicCard1.jpg', './img/magicCard2.jpg', './img/magicCard3.jpg', './img/magicCard4.jpg',
        './img/magicCard5.jpg', './img/magicCard6.jpg'])
        .then(img => {
            if (img) {
                // Save image as file
                img.write('./img/compileHand.jpg', () => {
                    console.log('merged');
                    readImageAndKickTweet();
                });
            }
        });
}