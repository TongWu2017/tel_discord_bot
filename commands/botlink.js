module.exports = {
    name: "botlink",
    description: "Get the invite links of the bots you mention",
    public: true,
    dm: true,
    guild: true,
    alises: ["botinvite"],
    async execute(message, args) {
        return message.mentions.users.filter(user => user.bot).forEach(bot => message.channel.send(`Invite link to the bot you mentioned: <https://discordapp.com/oauth2/authorize?client_id=${bot.id}&scope=bot&permissions=8>`))
    },
}