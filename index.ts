import { Client, GatewayIntentBits } from "discord.js";
import type { Documentation } from "typedoc-nextra"
import chalk from "chalk";
import "dotenv/config"
import * as fs from "node:fs"
import { Data, parseData } from "./helpers/parseData";

// Local Imports
import requestDPDocs from "./helpers/requestDPDocs";

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
})

client.debug = (message: string) => {
    const [right, left] = [chalk.blue("["), chalk.blue("]")]
    const debugMsg = `${left} ${chalk.yellow("DEBUG")} ${right} ${chalk.gray(message)}`

    console.log(debugMsg)
}

client.on("ready", async () => {
    client.debug(`Client connected as ${client.user?.username}`)

    client.debug(`Caching documentation from GitHub`)

    try {
        const docsData = await requestDPDocs()

        client.docsRawData = docsData

        client.isDocsLocal = false
    } catch (error) {
        client.debug("Failed to fetch documentation data from GitHub. Proceeding to use local data which maybe outdated")

        client.docsRawData = JSON.parse(fs.readFileSync("docs.json").toString("utf-8")) as Documentation

        client.isDocsLocal = true
    }

    client.debug(`Documentation cached. Parsing the data ...`)

    client.docsParsedData = parseData(client.docsRawData)

    client.isDocsReady = true
})

client.login(process.env.TOKEN)

declare module "discord.js" {
    interface Client {
        docsRawData: Documentation,
        debug: (message: string) => void,
        isDocsReady: boolean,
        isDocsLocal: boolean,
        docsParsedData: Map<
            "extractor"|"equalizer"|"discord-player"|"ffmpeg"|"opus"|"utils"|"downloader",
            Array<Data>
        >
    }
}