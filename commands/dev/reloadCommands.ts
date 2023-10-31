import type { SlashCommandProps, CommandOptions } from 'commandkit';
import { SlashCommandBuilder } from "discord.js"
import { parseData } from '../../helpers/parseData';
import requestDPDocs from '../../helpers/requestDPDocs';

export const data = new SlashCommandBuilder()
.setName("reload")
.setDescription("Reload the command handler")

export async function run({ interaction, client, handler }: SlashCommandProps) {
    await interaction.deferReply({ ephemeral: true });

    await handler.reloadCommands();
    client.debug('Reloaded commands');

    await handler.reloadValidations();
    client.debug('Reloaded validations');

    await handler.reloadEvents();
    client.debug('Reloaded events');

    const reloadData = await requestDPDocs(true)
    client.docsRawData = reloadData
    client.debug("Reloaded documentation raw data")

    const parse = parseData(reloadData)
    client.docsParsedData = parse
    client.debug("Reloaded documentation parsed data")

    interaction.followUp('Done!');
}

export const options: CommandOptions = {
    devOnly: true
}