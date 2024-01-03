const fetch = require("node-fetch");
const JSSoup = require('jssoup').default;
const { convert } = require('html-to-text');
const Discord = require("discord.js");
const numbers = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'];
const sources = ["[genius.com](https://genius.com)", "[azlyrics.com](https://www.azlyrics.com)", "[musixmatch.com](https://www.musixmatch.com)"];
module.exports = {
    name: "lyric",
    description: "get lyrics for a song",
    public: true,
    dm: false,
    guild: true,
    aliases: ["ly", "lyrics"],
    async execute(message, args) {
        var q;
        if (args.length > 0) {
            q = args.join(" ");
        } else {
            const spotify = message.member.presence.activities.find(activity => activity.name === "Spotify" && activity.type === "LISTENING");
            if (spotify) {
                q = `${spotify.details} ${spotify.state}`;
            } else {
                return message.reply({ embeds: [new Discord.MessageEmbed().setDescription("You did not specify a query as the argument(s) of this command to search lyrics from, neither do you have a [visible Spotify status](https://support.discord.com/hc/en-us/articles/360000167212) to search lyrics from.")] });
            }
        }
        const sourceSelection = await message.channel.send({
            embeds: [
                new Discord.MessageEmbed()
                    .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true, format: "png" }))
                    .setTitle("Choose the source of the lyric by reacting")
                    .setDescription("Sometimes, when one source does not have the lyrics to the song you desire, the other source does.")
                    .addFields(sources.map(s => new Object({ "name": numbers[sources.indexOf(s)], "value": s, "inline": true })))
            ],
            components: [
                new Discord.MessageActionRow().addComponents([
                    new Discord.MessageButton({ label: "1", customId: "1", style: "PRIMARY" }),
                    new Discord.MessageButton({ label: "2", customId: "2", style: "PRIMARY" }),
                    new Discord.MessageButton({ label: "3", customId: "3", style: "PRIMARY" })
                ])
            ]
        });
        /*
        for (const r in sources) source.react(numbers[r])
        const sourceChoice = (await source.awaitReactions({ filter: (r, u) => u.id === message.author.id, max: 1 })).first().emoji.name.split("\uFE0F\u20E3")[0]
        */
        var sourceChoice
        try {
            sourceChoice = (await sourceSelection.awaitMessageComponent({ filter: i => i.user.id === message.author.id, componentType: "BUTTON", time: 30000 })).component.customId;
        } catch {
            await sourceSelection.delete()
            return await message.reply("You left this command idle for too long (30 seconds), timed out.")
        }
        await sourceSelection.edit({ components: [] })
        const embed = new Discord.MessageEmbed().setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true, format: "png" })).setDescription(`Searching ${args.length ? "" : "your Spotify status "}"${q}" on ${sources[sourceChoice - 1]}`).setImage("https://cdn.discordapp.com/attachments/651657225126805514/870098070061326356/tenor.gif").setTimestamp();
        const selection = await message.channel.send({ embeds: [embed], components: [] });
        var searchResults;
        try {
            searchResults = await [geniusSearch, azSearch, musixSearch][sourceChoice - 1](q);
        } catch {
            searchResults = [];
        }
        if (searchResults.length === 0) {
            return await selection.edit({ embeds: [embed.setDescription(`No results ${args.length ? `from your search query` : `from your Spotify status`} "${q}" were found on ${sources[sourceChoice - 1]}`).setFooter("Please make sure you did not make any typo, or try using a different source.").setImage("https://cdn.discordapp.com/attachments/0").setTimestamp()] });
        }
        if (searchResults.length > 25) searchResults.length = 25;
        delete embed.image;
        embed
            .setDescription(`${searchResults.length} results ${args.length ? `from your search query` : `from your Spotify status`} "${q}" found on ${sources[sourceChoice - 1]}`)
            .setFooter("Click on the corresponding reaction to the song of which the lyric you want")
            .addFields(searchResults.map(result => new Object({
                'name': (searchResults.indexOf(result) + 1).toString(),
                'value': `**Song title:** ${result.song[1] ? `__[${result.song[0]}](${result.song[1]})__` : `__${result.song[0]}__`}\n**Song artist:** ${result.artist[1] ? `__[${result.artist[0]}](${result.artist[1]})__` : `__${result.artist[0]}__`}`,
                'inline': true
            })))
            .setTimestamp();
        const selectionButtons = []
        for (const buttonNumber in searchResults) {
            if (!selectionButtons[Math.floor(buttonNumber / 5)]) selectionButtons[Math.floor(buttonNumber / 5)] = [];
            const number = (+buttonNumber + 1).toString();
            selectionButtons[Math.floor(buttonNumber / 5)].push({ label: number, customId: number, style: "PRIMARY" })
        }
        await selection.edit({
            embeds: [embed],
            components: selectionButtons.map(row => new Discord.MessageActionRow()
                .addComponents(row.map(buttonData => new Discord.MessageButton(buttonData)))
            )
        });
        const index = searchResults[(await selection.awaitMessageComponent({ filter: i => i.user.id === message.author.id, componentType: "BUTTON" })).component.customId - 1];
        await selection.edit({ components: [] });
        await message.channel.bulkDelete([sourceSelection, selection])
        var lyrics;
        const lyric = new Discord.MessageEmbed().setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true, format: "png" })).setTitle(index.song[0]).setDescription(index.artist[0]).setFooter("Loading lyrics").setTimestamp();
        if (index.song[2]) lyric.setImage(index.song[2]);
        const final = await message.channel.send({ embeds: [lyric] });
        try {
            while (true) {
                lyrics = await [geniusLyrics, azLyrics, musixLyrics][sourceChoice - 1](index.song[1]);
                if (lyrics.length) break;
            }
            const lyricLines = lyrics.split("\n\n").map(verse => verse.split("\n"));
            const lyricLinesShortened = [];
            for (line of lyricLines) {
                if (line.join("\n").length <= 1024) {
                    lyricLinesShortened.push(line);
                } else {
                    const temp = [[]];
                    for (const singleline of line) {
                        if (temp[temp.length - 1].join("\n").length + "\n".length + singleline.length > 1024) temp.push([]);
                        temp[temp.length - 1].push(singleline);
                    };
                    for (const part of temp) lyricLinesShortened.push(part);
                }
            };
            const lyricsFields = lyricLinesShortened.map(lines => new Object({ "name": lines[0].startsWith("[") && lines[0].endsWith("]") ? lines.shift() : "\u200B", "value": lines.join("\n").length ? lines.join("\n") : "\u200B" }));
            delete lyric.footer;
            const lyricEmbeds = [new Discord.MessageEmbed(lyric)];
            for (const lyricsField of lyricsFields) {
                if (lyricEmbeds[lyricEmbeds.length - 1].fields.length === 25 || new Discord.MessageEmbed(lyricEmbeds[lyricEmbeds.length - 1]).addField(lyricsField.name, lyricsField.value).length > 6000) {
                    lyricEmbeds.push(new Discord.MessageEmbed(lyric));
                }
                lyricEmbeds[lyricEmbeds.length - 1].addField(lyricsField.name, lyricsField.value);
            }
            if (lyricEmbeds.length === 1) return final.edit({ embeds: [lyricEmbeds[0].setTimestamp()] });
            const lyricsButtons = []
            for (const buttonNumber in lyricEmbeds) {
                if (!lyricsButtons[Math.floor(buttonNumber / 5)]) lyricsButtons[Math.floor(buttonNumber / 5)] = [];
                const number = (+buttonNumber + 1).toString();
                lyricsButtons[Math.floor(buttonNumber / 5)].push({ label: number, customId: number, style: "SECONDARY" })
            }
            var lyricEmbedIndex = 0;
            const lyricButtonComponents = lyricsButtons.map(row => new Discord.MessageActionRow()
                .addComponents(row.map(buttonData => new Discord.MessageButton(buttonData)))
            );
            lyricButtonComponents.unshift(new Discord.MessageActionRow().addComponents([
                new Discord.MessageButton({ label: "⏮️", customId: "a", style: "PRIMARY", disabled: true }),
                new Discord.MessageButton({ label: "⏪", customId: "b", style: "PRIMARY", disabled: true }),
                new Discord.MessageButton({ label: "⏩", customId: "c", style: "PRIMARY" }),
                new Discord.MessageButton({ label: "⏭️", customId: "d", style: "PRIMARY" }),
                new Discord.MessageButton({ label: "❌", customId: "e", style: "DANGER" }),
            ]));
            await final.edit({
                embeds: [lyricEmbeds[0].setFooter(`Page 1 of ${lyricEmbeds.length}`).setTimestamp()],
                components: lyricButtonComponents
            });
            const lyricButtonCollector = final.createMessageComponentCollector({ filter: i => i.user.id === message.author.id, idle: 600000, type: "BUTTON" })
            lyricButtonCollector.on("collect", async interaction => {
                if (interaction.component.style === "SECONDARY") {
                    lyricEmbedIndex = +interaction.customId - 1;
                } else {
                    if (interaction.customId === "a") {
                        lyricEmbedIndex = 0;
                    } else if (interaction.customId === "b") {
                        lyricEmbedIndex -= 1;
                    } else if (interaction.customId === "c") {
                        lyricEmbedIndex += 1;
                    } else if (interaction.customId === "d") {
                        lyricEmbedIndex = lyricEmbeds.length - 1;
                    } else {
                        return lyricButtonCollector.stop("closed")
                    }
                }
                if (lyricEmbedIndex === 0) {
                    lyricButtonComponents[0] = new Discord.MessageActionRow().addComponents([
                        new Discord.MessageButton({ label: "⏮️", customId: "a", style: "PRIMARY", disabled: true }),
                        new Discord.MessageButton({ label: "⏪", customId: "b", style: "PRIMARY", disabled: true }),
                        new Discord.MessageButton({ label: "⏩", customId: "c", style: "PRIMARY" }),
                        new Discord.MessageButton({ label: "⏭️", customId: "d", style: "PRIMARY" }),
                        new Discord.MessageButton({ label: "❌", customId: "e", style: "DANGER" }),
                    ])
                } else if (lyricEmbedIndex === lyricEmbeds.length - 1) {
                    lyricButtonComponents[0] = new Discord.MessageActionRow().addComponents([
                        new Discord.MessageButton({ label: "⏮️", customId: "a", style: "PRIMARY" }),
                        new Discord.MessageButton({ label: "⏪", customId: "b", style: "PRIMARY" }),
                        new Discord.MessageButton({ label: "⏩", customId: "c", style: "PRIMARY", disabled: true }),
                        new Discord.MessageButton({ label: "⏭️", customId: "d", style: "PRIMARY", disabled: true }),
                        new Discord.MessageButton({ label: "❌", customId: "e", style: "DANGER" }),
                    ])
                }
                await interaction.update({
                    embeds: [lyricEmbeds[lyricEmbedIndex].setFooter(`Page ${lyricEmbedIndex + 1} of ${lyricEmbeds.length}`).setTimestamp()],
                    components: lyricButtonComponents
                });
            })
            lyricButtonCollector.on("end", (collected, reason) => {
                if (reason === "closed") {
                    final.delete()
                } else {
                    final.edit({
                        embeds: [lyric].setTimestamp(),
                        components: []
                    })
                }
            })

        } catch (error) {
            console.error(error);
            return final.edit({ content: "Something went wrong with this request, perhaps the lyrics to this song are unavailable or this song has no lyrics.", embeds: [lyric.setFooter("⚠ Something went wrong").setTimestamp()] });
        }

    },
}

async function geniusSearch(q) {
    const searchResults = (await (await fetch(`https://api.genius.com/search?q=${encodeURI(q)}`, { headers: { Authorization: "Bearer 0GxGbpt9xItcXPBQNXfujzZ-sxYj3f24B9_wjv7bue4oQFPNP7B5oes0BP8KyDrD" } })).json()).response.hits.map(res => new Object({ 'song': [res.result.title_with_featured, res.result.url, res.result.song_art_image_url], 'artist': [res.result.primary_artist.name, res.result.primary_artist.url] }));
    return searchResults;
};

async function azSearch(q) {
    const soup = new JSSoup(await (await fetch(`https://search.azlyrics.com/search.php?q=${encodeURI(q)}`)).text());
    const entries = [];
    for (const entry of soup.findAll("div", "panel").filter(result => result.find("div", "panel-heading").text.toLowerCase().includes("song") || result.find("div", "panel-heading").text.toLowerCase().includes("lyric"))) {
        entry.findAll("td", "text-left").forEach(e => entries.push(e))
    }
    const searchResults = [];
    for (const entry of entries) {
        const data = (new JSSoup(entry.toString().replace("<small>", "<!--").replace("</small>", "-->").replace(" href=\"", ">\n<b>").replace("html\">", "html</b>"))).findAll("b")
        if (searchResults.filter(i => i.song[1] == data[0].text).length === 0) searchResults.push({ 'song': [data[1].text.startsWith('"') && data[1].text.endsWith('"') ? data[1].text.substring(1, data[1].text.length - 1) : data[1].text, data[0].text], 'artist': [data[2].text] });
    }
    return searchResults;
};

async function musixSearch(q) {
    const html = await (await fetch(`https://www.musixmatch.com/search/${encodeURI(q)}/tracks`,)).text();
    const soup = new JSSoup(html);
    var list = soup.find("ul", "thumb-list").findAll("li", "showArtist");
    return list.map(item => new Object({ 'song': [item.find("a", "title").text, "https://www.musixmatch.com" + item.find("a", "title").toString().split('"').find(str => str.includes("/lyrics/")), item.find("img").toString().split('"').join(" ").split(" ").find(str => str.includes("s.mxmcdn.net"))], 'artist': [item.find("span", "artist-field").text] }));
}

async function geniusLyrics(url) {
    return convert(new JSSoup((await (await fetch(url)).text()).replaceAll("Lyrics__Container", "lyrics__container\" idk=\"")).findAll("div", "lyrics__container").join(""), { ignoreHref: true });
}

async function azLyrics(url) {
    return convert(new JSSoup(new JSSoup(await (await fetch(url)).text()).find("div", "col-lg-8").prettify().replace("<div>", "<div class=classthingyforlyricsthatnobodyshouldsee>")).find("div", "classthingyforlyricsthatnobodyshouldsee"));
}

async function musixLyrics(url) {
    const html = (await (await fetch(url, { follow: 0 })).text()).replace("col-sm-10 col-md-8 col-ml-6 col-lg-6", "idforlyricthingyhere col-sm-10 col-md-8 col-ml-6 col-lg-6");
    const soup = new JSSoup(html);
    if (soup.find("div", "review-changes")) soup.find("div", "review-changes").extract();
    var lyric = soup.find("div", "idforlyricthingyhere").find("span");
    return convert(lyric.prettify(), { preserveNewlines: true }).replace(/\n{3,}/g, "\n").replace(/^\s+|\s+$/g, '');
}