const fetch = require("node-fetch");
const JSSoup = require('jssoup').default;
const { convert } = require('html-to-text');
const Discord = require("discord.js");
const cheerio = require("cheerio")
module.exports = {
    name: "define",
    description: "get definition for a word",
    public: true,
    dm: true,
    guild: true,
    aliases: ["dictionary", "whatisa"],
    async execute(message, args) {
        try {
            const msg = await message.channel.send({ embeds: [new Discord.MessageEmbed().setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true, format: "png" })).setTitle(`Looking up definitions of ${args.join(" ")}...`).setDescription("LOADING").setTimestamp()] })
            const startTime = Date.now()
            const html = await (await fetch(`https://www.merriam-webster.com/dictionary/${encodeURI(args.join(" "))}`,)).text()
            const $ = cheerio.load(html);
            const defs = [];
            const vgs = $('div[class="vg"]');
            for (const vg of vgs) {
                new JSSoup($(vg).html()).findAll("div", "sb").forEach(d => defs.push(d));
            }
            const fields = [];
            for (const def of defs) {
                const authlist = []
                def.findAll("span", "auth").forEach(auth => {
                    authlist.push(convert(auth))
                    auth.extract()
                });
                const name = def.findAll("span", "dt").map(text => text.text.replace(": ", "")).join("\n");
                fields.push({ "name": "Definition:", "value": name.substring(0, 1024) });
            }
            if (fields.length === 0) return await msg.edit({ embeds: [new Discord.MessageEmbed().setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true, format: "png" })).setTitle(`No definition of ${args.join(" ")} is found. Perhaps you misspelt it, and one of the words below is what you meant to type.`).setDescription(new JSSoup(html).findAll("p", "spelling-suggestions").map(s => s.text).join("\n")).setTimestamp()] })
            if (fields.length > 25) fields.length = 25;
            try {
                await msg.edit({ embeds: [new Discord.MessageEmbed().setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true, format: "png" })).setTitle(`Definition${fields.length === 1 ? "" : "(s)"} of ${args.join(" ")}`).setDescription(`${fields.length} definition${fields.length === 1 ? "" : "(s)"} found • Took ${Date.now() - startTime}ms`).addFields(fields).setTimestamp()] });
            } catch (error) {
                console.error(error);
                message.reply("An error occured with the embedding process, which has been logged. Please alert the bot owner, who will check and fix the logged error.");
            }
        } catch (error) {
            console.error(error);
            message.reply("Unable to find anything for your word!");
        }
    },
}