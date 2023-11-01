import { Data, Client } from "./client"
import { getEmoji } from "./getEmoji";
import { APIApplicationCommandInteraction } from "discord-api-types/v10"
import { default as axios } from "axios"

const APP_ID = "1168430754825510912"

export async function followUp(content: string, ctx: APIApplicationCommandInteraction) {
    await axios.post(`https://discord.com/api/v10/webhooks/${APP_ID}/${ctx.token}`, {
        content
    })
}

export async function basicReply(interaction: APIApplicationCommandInteraction, client: Client) {
    let commandName = interaction.data.name

    if (commandName === "dp") commandName = "discord-player"

    // @ts-ignore
    const autocomplete = interaction.data.options[0].value as string

    // @ts-ignore
    const docs = client.docsParsedData.get(commandName) as Data[]

    const index = docs?.findIndex((val) => val.name === autocomplete)

    if(!index) return followUp("Cannot find `" + autocomplete + "` in our docs", interaction)

    const data = docs[index]

    if(!data) return followUp("Cannot find `" + autocomplete + "` in our docs", interaction)

    let string = `\\${getEmoji(data.type)} **__[${data.name}](<${data.url}>)__**`

    if(data.description) string += `\n${data.description}`

    followUp(string, interaction)
}