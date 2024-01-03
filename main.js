const Discord = require("discord.js");
const fs = require('fs')
const functions = require('./functions.js')
const { randomHex, remove, toWk, randC, rng, autoEmbed, timeCo, guildFind, now, sleep, save, print, scramble, randWord, gcd, msgUrl, getKeyByValue, objValueAmt, toOrdinalSuffix, unscramble } = functions
const config = require("./config.json");
const afk = require("./afk.json");
const snipe = require("./snipe.json");
const client = new Discord.Client({ intents: Object.keys(Discord.IntentsBitField.Flags), partials: ['CHANNEL'] });
//token.txt contains the token 
config.token = fs.readFileSync("token.txt", "utf8").trim()
client.vars = {}
client.mods = {}
client.mods.functions = functions
client.mods.config = config
client.mods.afk = afk
client.mods.snipe = snipe
client.commands = new Discord.Collection()
client.commands_ = new Discord.Collection()
for (const file of fs.readdirSync('./commands').filter(file => file.endsWith('.js'))) {
    try {
        const command = require(`./commands/${file}`);
        client.commands.set(file.replace(".js", ""), command);
        if (command.aliases) {
            for (i in command.aliases) {
                client.commands_.set(command.aliases[i], command);
            }
        }
    } catch {
        console.warn(`FAILED TO LOAD the command ${file}`)
    }
}

client.vars.phone = { "wait": false }
client.vars.cooldown = []

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag} ${Date()}`);
    client.user.setActivity("tel help");
});

client.on('messageDelete', message => {
    if (!message.guild) return;
    if (message.author.bot) return;
    const cid = "s" + message.channel.id;
    if (!snipe[cid]) snipe[cid] = [];
    if (snipe[cid].length > 19) snipe[cid].splice(0, 1);
    var snipeData = {
        "msg": message.content,
        "id": message.author.id,
        "time": Date.now()
    }
    if (message.attachments.first()) snipeData.img = message.attachments.first().proxyURL;
    snipe[cid].push(snipeData);
    save(snipe, "snipe.json")
});

client.on('messageDeleteBulk', messages => {
    if (!messages.first().guild) return;
    const cid = "p" + messages.first().channel.id;
    if (!snipe[cid]) snipe[cid] = [];
    const messagesArray = messages.map(m => m);
    messagesArray.reverse()
    for (const message of messagesArray) {
        if (message.author.bot) return;
        if (snipe[cid].length > 19) snipe[cid].splice(0, 1);
        var snipeData = {
            "msg": message.content,
            "id": message.author.id,
            "time": Date.now()
        }
        if (message.attachments.first()) snipeData.img = message.attachments.first().proxyURL;
        snipe[cid].push(snipeData);
    }
    save(snipe, "snipe.json")
});

client.on('messageUpdate', (oldMsg, newMsg) => {
    if (oldMsg.content == newMsg.content) return
    onMessage(newMsg)
    if (!newMsg.guild) return
    if (oldMsg.channel.guild) {
        if (!newMsg.author.bot) {
            const cid = "e" + newMsg.channel.id;
            if (typeof snipe[cid] == 'undefined') {
                snipe[cid] = [];
            }
            if (snipe[cid].length > 19) {
                snipe[cid].splice(0, 1);
            }
            if (snipe[cid].find(x => x.msgId == oldMsg.id) == undefined) {
                snipe[cid].push({
                    "arr": [],
                    "id": oldMsg.author.id,
                    "msgId": oldMsg.id,
                    "time": Date.now()
                })
            }
            snipe[cid].find(x => x.msgId == oldMsg.id).arr.push({ "msg": oldMsg.content, "time": Date.now() })
            save(snipe, "snipe.json")
        }
    }
});

client.on("messageCreate", async message => {

    if (client.vars.phone[message.channel.id]) {
        if (message.author.bot) return
        var prefix
        if (!message.guild || config.servers[message.guild.id].prefixes == null) {
            prefix = config.prefix
        } else {
            prefix = config.servers[message.guild.id].prefixes
        }
        if (message.content.toLowerCase().indexOf(prefix) == 0 && message.content.slice(prefix.length).trim().split(/ +/g)[0].toLowerCase() === "phone") return
        const embed = new Discord.MessageEmbed().setDescription(`**${message.author.tag}**: ${message.content}`)
        if (message.attachments.size > 0) embed.setImage(message.attachments.first().url)
        var reference;
        if (message.reference) {
            reference = (await message.channel.messages.fetch(message.reference.messageId)).originalMsgId;
        }
        client.channels.fetch(client.vars.phone[message.channel.id]).then(channel => channel.send({ embeds: [embed], reply: reference ? { messageReference: reference, failIfNotExists: false } : undefined, allowedMentions: { repliedUser: false } }).then(m => {
            channel.messages.fetch(m.id).then(msg => msg.originalMsgId = message.id)
        }));
    }//phone command
    if (!message.guild) return
    const gid = message.guild.id

    if (message.author.bot) return; //above = bot; below != bot

    if ((config.servers[gid] && config.servers[gid].disabled && config.servers[gid].disabled._ && config.servers[gid].disabled._.includes("afk")) === false) {
        for (afkMention of message.mentions.users) {
            if (afk[afkMention[1].id]) {
                const afkObj = JSON.parse(JSON.stringify(afk[afkMention[1].id]))
                const afkEmbed = new Discord.MessageEmbed()
                    .setColor(randomHex())
                    .setDescription(`${afkMention[1].toString()} is currently afk${afkObj.message ? `: ${afkObj.message}` : '.'}`)
                    .setFooter("They have been afk for " + timeCo(message.createdTimestamp - afkObj.time))
                if (afkObj.image) afkEmbed.setImage(afkObj.image)
                message.channel.send({ embeds: [afkEmbed] });
            }
        }
    }
    //shows afk users who are mentioned as afk

    if (afk[message.author.id]) {
        if (message.createdTimestamp - afk[message.author.id].time > 10000) {
            delete afk[message.author.id]
            const m = await message.reply("welcome back! Your afk has been removed.");
            m.delete({ timeout: 5000 }).catch(() => { })
            save(afk, 'afk.json');
        }
    }//removes afk people 

}); //auto functions

client.on("messageCreate", onMessage); //text commands

async function onMessage(message) {
    if (message.author.bot) return
    const prefix = message.guild && config.servers[message.guild.id] ? config.servers[message.guild.id].prefixes ? config.servers[message.guild.id].prefixes : config.prefix : config.prefix
    if (message.content.toLowerCase().indexOf(prefix) !== 0) return
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    const mid = message.author.id
    var cid = message.channel.id
    const gid = message.guild ? message.guild.id : undefined
    message.vars = {}
    message.vars.mid = mid
    message.vars.cid = cid
    message.vars.gid = gid
    message.vars.prefix = prefix

    if (client.commands.has(command) || client.commands_.has(command)) {
        const exc = client.commands.get(command) || client.commands_.get(command)
        try {
            if (exc.public) {
                if (gid && exc.guild) {
                    if (config.servers[gid] && config.servers[gid].disabled) {
                        if (config.servers[gid].disabled._ && config.servers[gid].disabled._.includes(exc.name)) {
                            if (config.servers[gid].enabled && config.servers[gid].enabled[cid] && config.servers[gid].enabled[cid].includes(exc.name)) {
                                0
                            } else {
                                return message.reply("this command has been disabled in this server.").catch(console.error)
                            }
                        }
                        if (config.servers[gid].disabled[cid] && config.servers[gid].disabled[cid].includes(exc.name)) {
                            return message.reply("this command has been disabled in this channel.")
                        }
                    }
                    await exc.execute(message, args);
                } else if (exc.dm) {
                    await exc.execute(message, args);
                }
            } else if (mid == config.owner) {
                await exc.execute(message, args);
            }
        } catch (error) {
            console.error(`Error in ${message.channel.name} (${message.channel.id})`);
            console.error(error);
            message.reply('there was an error trying to execute that command!');
        }
        return
    }
};

client.login(config.token);