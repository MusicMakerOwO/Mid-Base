module.exports = {
    name: 'ping',
    async execute(message, client) {
        message.channel.send('Pong')
    }
}