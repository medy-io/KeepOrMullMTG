export function randomlyChooseMtgFormat(): string {
    var formatList = ['ST', 'PI', 'MO', 'LE', 'VI']; // mtg top 8
    var formatList2 = ['standard', 'pioneer', 'modern', 'legacy', 'vintage', 'pauper', 'historic']; // mtggoldfish
    return formatList2[Math.floor(Math.random() * formatList.length)];
}