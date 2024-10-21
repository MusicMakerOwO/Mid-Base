const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('poke')
    .setDescription('poke the button'),
    async execute(interaction, client) {
        const button = new ButtonBuilder()
        .setCustomId('poke')
        .setLabel('Poke')
        .setStyle(ButtonStyle.Primary)
        const row = new ActionRowBuilder()
        .addComponents(button)

        await interaction.reply({ content: 'Poke me!', components: [row]})
    }
}