import { parseData } from "./helpers/parseData"
import requestDPDocs from "./helpers/requestDPDocs";

(async () => {
    const docs = await requestDPDocs()
    console.log(Object.fromEntries(parseData(docs)))
})()