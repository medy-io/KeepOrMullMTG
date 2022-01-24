// create list of card image urls
export function createCardImageURL(deckData) {
    for (var i = 0; i < CONSTANTS.HAND_SIZE; i++) {
        var cardIndex = Math.floor(Math.random() * deckData.length);
        let chosenCard = deckData.splice(cardIndex, 1)[0];
        card.push(chosenCard);
        dest.push('https://api.scryfall.com/cards/named?exact=' + card[i] + ';format=image;version=normal');
    }
}