module.exports = {
    customId: 'menus',
    async execute(interaction, client) {
        await interaction.channel.send('menu worked')
    }
}