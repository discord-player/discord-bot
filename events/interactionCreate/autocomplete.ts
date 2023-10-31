import type { Client, Interaction } from "discord.js"
import type { CommandKit } from 'commandkit';
import { Data } from "../../helpers/parseData";
import Fuse from "fuse.js";

export default async function (interaction: Interaction, client: Client<true>, _handler: CommandKit) {
    if (!interaction.isAutocomplete()) return

    const name = interaction.commandName

    const query = interaction.options.getString("query")

    if (!query) return interaction.respond([])

    const data = client.docsParsedData.get(name === "dp" ? "discord-player" : name as "extractor"|"equalizer"|"ffmpeg"|"opus"|"utils"|"downloader") as Data[]

    let stringOfNames = data.map(e => e.name)

    if (!query.includes("#")) stringOfNames = stringOfNames.filter((e) => !e.includes("#"))

    const fuse = new Fuse(stringOfNames, {
        includeScore: true
    })

    const res = fuse.search(query).sort((a, b) => {
        if (!a.score || !b.score) return 0
        return a.score - b.score
    })
        .slice(0, 25)

    interaction.respond(res.map(val => ({ name: val.item, value: val.item })))
};