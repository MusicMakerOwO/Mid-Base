const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('test')
    .setDescription('test placeholder'),
    async execute(interaction, client) {
        const menu = new StringSelectMenuBuilder()
        .setCustomId('menus')
        .setPlaceholder('TESTING')
        .addOptions(
            {
                label: 'test',
                description: 'tst',
                value: 'opt'
            }
        );

        const row = new ActionRowBuilder()
        .addComponents(menu)

        await interaction.reply({ content: 'hello', components: [row] })
    }
}