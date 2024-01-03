const Discord = require("discord.js");
module.exports = {
    name: "purge",
    description: "bulk delete a number of messages, or all messages after a certain one (non-inclusive)",
    public: true,
    dm: false,
    guild: true,
    aliases: ["bulkdelete", "massdelete"],
    async execute(message, args) {
        if (!message.member.permissions.has("MANAGE_MESSAGES")) return message.reply("You lack permissions to use this command (manage messages).");
        if (!args.length) return message.reply("You need to specify a number of messages to purge, or a message ID to purge all messages after it.");
        var m = args[0];
        if (!+m) return message.reply({ embeds: [Discord.MessageEmbed().setTitle("This is not a valid number or message ID for the first argument: ").setDescription(m)] });
        var isMsg;
        try {
            isMsg = await message.channel.messages.fetch(m);
        } catch {
        }

        if (!isMsg) {
            if (m < 0) return message.reply({ embeds: [Discord.MessageEmbed().setTitle("The number you stated as your first argument is too low: ").setDescription(m)] });
            if (m > 10000) return message.reply({ embeds: [Discord.MessageEmbed().setTitle("The number you stated as your first argument is too big (> 10000): ").setDescription(m)] });
            m = +m + 1;
        }
        const user = args[1];
        var targetUser;
        if (user) {
            targetUser = message.mentions.users.first() || await message.client.users.fetch(user);
        }
        var last;
        var res = new Discord.Collection();
        if (isMsg) {
            while (true) {
                const fetched = await message.channel.messages.fetch({ limit: 100, before: last });
                last = fetched.lastKey();
                res = res.concat(fetched);
                if (fetched.size < 100) break;
                if (fetched.some(msg => msg.id <= m)) break;
            }
            res.sweep(msg => msg.id <= m);
        } else {
            console.log(m);
            while (true) {
                const fetched = await message.channel.messages.fetch({ limit: +m - res.size < 100 ? +m - res.size : 100, before: last });
                last = fetched.lastKey();
                res = res.concat(fetched);
                if (fetched.size < 100) break;
                if (res.size === +m) break;
            }
            console.log(res.size)
        }
        if (targetUser) res.sweep(msg => msg.author.id !== targetUser.id);
        const bdArr = [];
        while (bdArr.length < Math.ceil(res.size / 100)) {
            bdArr.push([]);
        }
        for (const n in res.map(r => r.id)) {
            bdArr[Math.floor(n / 100)].push(res.map(r => r.id)[n]);
        }
        for (const toBd of bdArr) {
            message.channel.bulkDelete(toBd, { filterOld: true });
        }
    },
}