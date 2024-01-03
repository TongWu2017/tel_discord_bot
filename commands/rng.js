module.exports = {
    "name": "rng",
    "description": "Random number",
    "public": true,
    "dm": true,
    "guild": true,
    "aliases": [],
    execute: function (message, args) {
        const autoEmbed = message.client.mods.functions.autoEmbed;
        const lower = +args[0];
        const upper = +args[1];
        if (!(lower && upper)) return message.reply("Two numbers are needed");
        message.channel.send({ embeds: [autoEmbed((Math.floor(Math.random() * (upper - lower + 1)) + lower).toString())] });
    }
}