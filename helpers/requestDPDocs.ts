import type { Documentation } from "typedoc-nextra";
import * as fs from "node:fs"

const DEFAULT_DP_DOCS_URL = "https://raw.githubusercontent.com/Androz2091/discord-player/master/apps/website/src/data/docs.json"

export default async function requestDPDocs(saveToFile = false) {
    const data = await fetch(DEFAULT_DP_DOCS_URL)

    if(data.status !== 200) throw new Error("Failed to fetch docs.json from github")

    const jsonData = await data.json() as Documentation
    
    if(saveToFile) fs.writeFileSync("docs.json", JSON.stringify(jsonData, null, 4))

    return jsonData
}