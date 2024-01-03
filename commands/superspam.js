module.exports = {
    name: "superspam",
    description: "Spam something 100 times",
    public: true,
    dm: false,
    guild: true,
    aliases: [],
    async execute(message, args) {
        const Discord = require("discord.js")
        const { client } = message
        const { config, functions, } = client.mods
        const { randomHex, autoEmbed, } = functions
        const { gid } = message.vars
        if (!config.servers[gid] || !config.servers[gid].spamAllowedChannels || config.servers[message.guild.id].spamAllowedChannels.length == 0) {
            return message.reply("This server does not allow superspam. To allow superspam in a channel, ask someone with Manage Server permissions to do `tel config allowspam` in it.");
        }
        if (!config.servers[gid].spamAllowedChannels.includes(message.channel.id)) {
            return message.reply(`This channel does not allow superspam. To allow superspam in this channel, ask an admin to do \`tel config allowspam\` in this channel. Here is a list of all channel(s) in this server that allow superspam: <#${config.servers[message.guild.id].spamAllowedChannels.join(">, <#")}>`);
        }

        if (args[0] == null) {
            return message.reply("what am I supposed to do if you don't give me anything to spam?");
        }
        const newSSEmbed = new Discord.MessageEmbed()
            .setTitle("Someone used the superspam command!")
            .setAuthor(message.author.username + "#" + message.author.discriminator, message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }))
            .setColor("DARK_BLUE")
            .setDescription(args.join(" "));
        client.vars.lalaLogs.send({ embeds: [newSSEmbed] });
        for (spamN = 0; spamN < 100; spamN++) {
            await message.channel.send({ embeds: [autoEmbed(args.join(" "))] });
        }
        return
    },
}