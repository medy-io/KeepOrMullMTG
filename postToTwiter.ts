// post tweet with image and deck data
export function postToTwitter() {
    Twitter.post('media/upload', { media_data: b64content }, function (err, data, response) {
        if (err) {
            console.log('ERROR:');
            console.log(err);
        } else {
            console.log('Image uploaded!');
            console.log('Now tweeting it...');

            Twitter.post('statuses/update', {
                status: 'Deck: ' + deckObj.title + '\n' + 'On the ' + globalConst.PLAY_OR_DRAW + '\n' + 'Format: ' + singleEventDataPoint.format + '\n' + 'Deck list: ' + globalConst.DECK_LINK + eventId + '&d=' + deckObj.id + '&f=' + chooseFormat + '\n' + '#KeepOrMull' + '\n' + '#MTG' + singleEventDataPoint.format + '\n' + '#MTG',
                media_ids: new Array(data.media_id_string)
            },
                (err, data, response) => {
                    if (err) {
                        console.log('ERROR:');
                        console.log(err);
                    } else {
                        console.log('Posted an image!');
                    }
                }
            );
        }
    });
}