import type { SlashCommandProps, CommandOptions } from 'commandkit';
import { SlashCommandBuilder } from "discord.js"
import { Data } from '../../helpers/parseData';

export const data = new SlashCommandBuilder()
.setName("dp")
.setDescription("Search the Discord Player documentation")
.addStringOption(option => 
    option.setName(`query`)
    .setDescription(`The query to search for`)
    .setAutocomplete(true)
    .setRequired(true)
)

export async function run({ interaction, client, handler }: SlashCommandProps) {
    const autocomplete = interaction.options.getString(`query`)
    
    await interaction.deferReply()

    const docs = client.docsParsedData.get("discord-player") as Data[]

    const index = docs?.findIndex((val) => val.name === autocomplete)
    
    if(!index) return interaction.followUp("Cannot find `" + autocomplete + "` in our docs")

    const data = docs[index]
    
    let string = `**__[${data.name}](<${data.url}>)__**`

    if(data.description) string += `\n${data.description}`

    return interaction.followUp(string)
}