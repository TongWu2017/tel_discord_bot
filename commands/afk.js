module.exports = {
    name: "afk",
    description: "Go afk (away from keyboard), supports images",
    public: true,
    dm: true,
    guild: true,
    async execute(message, args) {
        const { client } = message
        const { afk, functions } = client.mods
        const { autoEmbed, save } = functions
        const { mid, cid, gid, prefix } = message.vars
        var afkImg
        var afkMsg
        args.length > 0 ? afkMsg = args.join(" ") : afkMsg
        if (message.attachments.size !== 0) {
            afkImg = message.attachments.first().proxyURL
        }
        const afkEmbed = autoEmbed('')
            .setTitle(" ")
            .setDescription(`${message.author.toString()} is now afk${args.length > 0 ? `: ${args.join(" ")}` : "."}`);
        afkImg ? afkEmbed.setImage(afkImg) : false
        afk[mid] ? message.reply({ content: "you were already afk, your afk message has been updated:", embeds: [afkEmbed] }) : message.channel.send({ embeds: [afkEmbed] })
        afk[mid] = {};
        afk[mid].time = message.createdTimestamp;
        if (afkMsg) afk[message.author.id].message = afkMsg;
        if (afkImg) afk[message.author.id].image = afkImg;
        save(afk, 'afk.json')
        return
    },
}