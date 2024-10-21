const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder} = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('say')
    .setDescription('Make the bot say something'),
    async execute(interaction, client) {
        const modal = new ModalBuilder()
        .setCustomId('say')
        .setTitle('Say Something!')

        const text = new TextInputBuilder()
        .setRequired(true)
        .setLabel('Enter Text Here!')
        .setStyle(TextInputStyle.Paragraph)
        .setCustomId('txt')

        const row = new ActionRowBuilder()
        .addComponents(text)

        modal.addComponents(row)

        await interaction.showModal(modal)
    }
}