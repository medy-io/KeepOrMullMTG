import { randomlyChooseMtgFormat } from "./randomlyChooseMtgFormat";

export function createDataUrl(): any {
    // const MTG_TOP_8_URL = 'http://mtgtop8.com/format?f=' + randomlyChooseMtgFormat() + '&meta=52';
    const FORMAT: string = randomlyChooseMtgFormat();
    const MTG_GOLDFISH_URL = 'https://www.mtggoldfish.com/metagame/' + FORMAT + '#paper';
    return {MTG_GOLDFISH_URL: MTG_GOLDFISH_URL, FORMAT: FORMAT };
}