module.exports = {
    name: "nimrod",
    description: "Are you an idiot, a nimrod, a nimroy, or a mythical nimroyasaurus?",
    public: true,
    dm: true,
    guild: true,
    aliases: [],
    async execute(message, args) {
        const value = Math.floor(Math.random() * 10001)
        return message.reply(value == 10000 ? "you are a nimroyasaurus!" : value > 8500 ? "you are a nimroy!" : value > 6000 ? "you are a nimrod!" : "you are an idiot!")
    },
}