import { Client } from "./helpers/client";
import express from "express";
import { InteractionResponseType } from "discord-api-types/v10"
import Fuse from "fuse.js"
import { Data } from "./helpers/client";
import { basicReply } from "./helpers/basicReply";

const client = new Client(express())

process.on("uncaughtException", (e) => client.debug("ERROR: " + e.message))

client.on("ready", (port) => {
    client.debug(`Ready on port ${port}`)
})

client.on("interactionAutoComplete", async (ctx, res) => {
    const name = ctx.data.name

    // @ts-ignore
    const query = ctx.data.options[0].value as string

    if(!query) return res.json({
        type: InteractionResponseType.ApplicationCommandAutocompleteResult,
        data: {
            choices: []
        }
    })

    const data = client.docsParsedData.get(name === "dp" ? "discord-player" : name as "extractor"|"equalizer"|"ffmpeg"|"opus"|"utils"|"downloader") as Data[]

    if(!data) {
        return res.json({
            type: InteractionResponseType.ApplicationCommandAutocompleteResult,
            data: {
                choices: []
            }
        })
    }

    let stringOfNames = data.map(e => e.name)

    if (!query.includes("#")) stringOfNames = stringOfNames.filter((e) => !e.includes("#"))
    
    const fuse = new Fuse(stringOfNames, {
        includeScore: true
    })

    const response = fuse.search(query).sort((a, b) => {
        if (!a.score || !b.score) return 0
        return a.score - b.score
    })
        .slice(0, 25)

    res.json({
        type: InteractionResponseType.ApplicationCommandAutocompleteResult,
        data: {
            choices: response.map(val => ({ name: val.item, value: val.item }))
        }
    })
})

client.on("interactionCommand", async (ctx, res) => {
    res.send({
        type: InteractionResponseType.DeferredChannelMessageWithSource
    })

    basicReply(ctx, client)
})

client.login(process.env.PUBLIC_KEY as string, process.env.TOKEN as string, process.env.PORT || 3000)