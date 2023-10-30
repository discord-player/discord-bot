import type { SlashCommandProps, CommandOptions } from 'commandkit';
import { SlashCommandBuilder } from "discord.js"

export const data = new SlashCommandBuilder()
.setName("reload")
.setDescription("Reload the command handler")

export async function run({ interaction, client, handler }: SlashCommandProps) {
    interaction.deferReply({ ephemeral: true });

    await handler.reloadCommands();
    client.debug('Reloaded commands');

    await handler.reloadValidations();
    client.debug('Reloaded validations');

    await handler.reloadEvents();
    client.debug('Reloaded events');

    interaction.followUp('Done!');
}

export const options: CommandOptions = {
    devOnly: true
}