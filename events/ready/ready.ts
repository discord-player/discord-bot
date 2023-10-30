import type { Client } from "discord.js"
import type { CommandKit } from 'commandkit';
import requestDPDocs from "../../helpers/requestDPDocs";
import { parseData } from "../../helpers/parseData";
import type { Documentation } from "typedoc-nextra";
import * as fs from "node:fs"

export default async function (_c: Client<true>, client: Client<true>, _handler: CommandKit) {
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
    
    client.debug(`Data parsed!`)
};