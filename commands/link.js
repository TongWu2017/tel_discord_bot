module.exports = {
    name: "link",
    description: "Link to invite me",
    public: true,
    dm: true,
    guild: true,
    aliases: ["invite"],
    async execute(message, args) {
        return message.reply(` here's a link to invite this bot! <https://discordapp.com/oauth2/authorize?client_id=${message.client.user.id}&scope=bot&permissions=8>`);
    },
}