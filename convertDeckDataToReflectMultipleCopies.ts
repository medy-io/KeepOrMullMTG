// format deck data to include multiple copies of certain cards
export function convertDeckDataToReflectMultipleCopies(deckData) {
    let deck = [];
    for (let i = 0; i < deckData.cards.length; i++) {
        if (deckData.cards[i] && deckData.cards[i].count && deckData.cards[i].name) {
            var cardCount = deckData.cards[i].count;
            var cardName = deckData.cards[i].name;
            for (let i = 0; i < cardCount; i++) {
                deck.push(cardName);
            }
        }
    }
    return deck;
}