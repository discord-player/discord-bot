import type { SlashCommandProps } from 'commandkit';
import { SlashCommandBuilder } from "discord.js"
import { basicReply } from '../../helpers/basicReply';

export const data = new SlashCommandBuilder()
.setName("equalizer")
.setDescription("Search the @discord-player/equalizer documentation")
.addStringOption(option => 
    option.setName(`query`)
    .setDescription(`The query to search for`)
    .setAutocomplete(true)
    .setRequired(true)
)

export async function run({ interaction, client, handler }: SlashCommandProps) {
    basicReply(interaction, client)
}