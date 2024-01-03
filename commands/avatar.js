module.exports = {
    name: "avatar",
    description: "See the avatar of someone",
    public: true,
    dm: true,
    guild: true,
    aliases: ['av'],
    async execute(message, args) {
        const { client } = message
        const { functions } = client.mods
        const { guildFind } = functions
        const user = guildFind(message) || message.author
        message.channel.send({ content: `${user.tag}'s avatar`, files: [`${user.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 })}`] });
    },
}