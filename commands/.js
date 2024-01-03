module.exports = {
    public: false,
    execute(message, args) {
        return message.channel.send(`Hello ${message.author.toString()}! I'm online!`);
    },
}