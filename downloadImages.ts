// download each card image and wait for all card image promises to resolve, then call mergeImages()
export function downloadImages() {
    try {
        let pList = [];
        for (let i = 0; i < 7; i++) {
            pList.push(request.head(dest[i]));
        }
        Promise.all(pList).then(() => {
            for (let i = 0; i < 7; i++) {
                downloadCardImage(i);
            }
        });
    } catch (err) {
        console.log(err);
    }
}