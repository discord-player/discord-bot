import { Client, Events, GatewayIntentBits } from "discord.js";
import type { Documentation } from "typedoc-nextra"
import chalk from "chalk";
import "dotenv/config"
import path = require("node:path");
import { CommandKit } from 'commandkit';
import express, { Express } from "express"

// Local Imports
import { Data } from "./helpers/parseData";

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
})

client.webapp = express()

new CommandKit({
    client,
    commandsPath: path.join(__dirname, 'commands'),
    eventsPath: path.join(__dirname, 'events'),
    devGuildIds: ["1128736663573643315"],
    devUserIds: ['916316955772862475', "691111067807514685"],
    bulkRegister: true
})

client.debug = (message: string) => {
    const [left, right] = [chalk.blue("["), chalk.blue("]")]
    const debugMsg = `${left} ${chalk.yellow("DEBUG")} ${right} ${chalk.gray(message)}`

    console.log(debugMsg)
}

process.on("uncaughtException", (err) => client.debug(`ERROR ${err.message}`))

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
        >,
        webapp: Express
    }
}

// for express

client.webapp.get("/", (req, res) => {
    res.send("Keep Alive")
})

const port = process.env.PORT || 3000

client.webapp.listen(port, () => client.debug(`Keep Alive server started on ${port}`))