export function randomlyChooseDeckArchetype(lists: any) {
    return lists[Math.floor(Math.random() * lists.length)];
}