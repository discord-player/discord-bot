import { ChatInputCommandInteraction, Client } from "discord.js";
import { Data } from "./parseData";
import { getEmoji } from "./getEmoji";

export async function basicReply(interaction: ChatInputCommandInteraction, client: Client) {
    let { commandName } = interaction

    if(commandName === "dp") commandName = "discord-player"

    const autocomplete = interaction.options.getString("query", true)
        .replaceAll("📚 ", "")
        .replaceAll("🔧 ", "")
        .replaceAll("⭕ ", "")
        .replaceAll("🗝️ ", "")
        .trim()

    await interaction.deferReply()

    // @ts-ignore
    const docs = client.docsParsedData.get(commandName) as Data[]

    const index = docs?.findIndex((val) => val.name === autocomplete)
    
    if(!index) return interaction.followUp("Cannot find `" + autocomplete + "` in our docs")

    const data = docs[index]

    if(!data) return interaction.followUp("Cannot find `" + autocomplete + "` in our docs")
    
    let string = `${getEmoji(data.type)} **__[${data.name}](<${data.url}>)__**`

    if(data.description) string += `\n${data.description}`

    return interaction.followUp(string)
}