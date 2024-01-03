module.exports = {
    name: "math",
    description: "Do some math xD",
    public: true,
    dm: false,
    guild: true,
    aliases: [],
    async execute(message, args) {
        const Discord = require("discord.js")
        const { client } = message
        const { functions } = client.mods
        const { remove, rng } = functions
        if (args.length == 0) return
        if (args[0].toLowerCase() == "i") {
            var terms = 2;
            var eq = "";
            var coefficient;
            var sol = "";
            for (var i = 0; i < terms; i++) {
                coefficient = rng(-10, 10);
                while (coefficient == 0) coefficient = rng(-10, 10);
                if (terms - i > 1) {
                    sol += coefficient + "(x^" + (terms - i) + ")+";
                    eq += coefficient * (terms - i) + '(x^' + (terms - i - 1) + ")+";
                    eq = eq.replace('x^1', 'x').replace('x^0', '1').replace('+-', '-')
                    sol = sol.replace('x^1', 'x').replace('x^0', '1').replace('+-', '-')

                } else {
                    sol += coefficient + '*x'
                    eq += coefficient * (terms - i)
                    eq = eq.replace('x^1', 'x').replace('x^0', '1').replace('+-', '-')
                    sol = sol.replace('x^1', 'x').replace('x^0', '1').replace('+-', '-')
                }
            }
            eq = eq.replace('x^1', 'x').replace('x^0', '1').replace('+-', '-')
            sol = sol.replace('x^1', 'x').replace('x^0', '1').replace('+-', '-')
            var upper = rng(5, 9);
            var lower = rng(1, 4);
            var answer = eval((sol.split("(x^").join(`*(${upper}**`)).split('x').join(upper)) - eval((sol.split("(x^").join(`*(${lower}**`)).split('x').join(lower));

            const embed = new Discord.MessageEmbed()
                .setTitle(`Integrate the given polynomial from ${lower} to ${upper}!`)
                .setDescription(eq)
                .setColor('#6200db')
                .setFooter(`Imagine knowing how to do this`)
            const m = await message.channel.send({ embeds: [embed]})
            message.channel.awaitMessages(msg => msg.content == answer, { max: 1, time: 300000 }).then(messages => {
                if (!messages.first()) return m.edit({ embeds: [embed.setTitle(`Integrate the given polynomial from ${lower} to ${upper}! [Expired after 5 minutes]`).setColor("RED").setFooter("oof")]})
                const { member } = messages.first()
                m.edit({ embeds: [embed.setTitle(`Integrate the given polynomial from ${lower} to ${upper}! [Solved by ${member.displayName}]`).setColor("GREY").setFooter("If you didn't get it, try harder next time!")]})
                message.channel.send(`${member.toString()} congratulations! You found the definite integral of ${eq}!`)
            }).catch(console.error)

        }
        if (args[0].toLowerCase() == "d") {
            var terms = rng(1, 5);
            var eq = "";
            var coefficient;
            var sols = "";
            for (var i = 0; i < terms; i++) {
                coefficient = rng(-10, 10);
                while (coefficient == 0) coefficient = rng(-10, 10);

                if (terms - i > 1) {
                    eq += coefficient + "x^" + (terms - i) + "+";
                    sols += coefficient * (terms - i) + 'x^' + (terms - i - 1) + "+";
                    sols = sols.replace('x^1', 'x').replace('x^0', '1').replace('+-', '-')
                    eq = eq.replace('x^1', 'x').replace('x^0', '1').replace('+-', '-')
                }
                else {
                    eq += coefficient + 'x+'
                    sols += coefficient * (terms - i)
                    sols = sols.replace('x^1', 'x').replace('x^0', '1').replace('+-', '-')
                    eq = eq.replace('x^1', 'x').replace('x^0', '1').replace('+-', '-')
                }
            }
            sols = sols.replace('x^1', 'x').replace('x^0', '1').replace('+-', '-')
            eq = eq.replace('x^1', 'x').replace('x^0', '1').replace('+-', '-')

            eq += rng(1, 10);
            const embed = new Discord.MessageEmbed()
                .setTitle("Find the derivative of this equation!")
                .setDescription(eq)
                .setColor('#6200db')
                .setFooter(`Imagine knowing how to do this-`)
            const m = await message.channel.send({ embeds: [embed]})
            message.channel.awaitMessages(msg => msg.content && msg.content.toLowerCase().split(/ +/g).join("") == sols, { max: 1, time: 300000 }).then(messages => {
                if (!messages.first()) return m.edit({ embeds: [embed.setTitle("Find the derivative of this equation! [Expired after 5 minutes]").setDescription(eq).setColor("RED").setFooter("oof")]})
                const { member } = messages.first()
                m.edit({ embeds: [embed.setTitle(`Find the derivative of this equation! [Solved by ${member.displayName}]`).setDescription(eq).setColor("GREY").setFooter("If you didn't get it, try harder next time!")]})
                message.channel.send(`${member.toString()} congratulations! You found the derivative of ${eq}!`)
            }).catch(console.error)
        }
        if (args[0].toLowerCase() == "e") {
            var x = rng(-9, 9);
            while (x == 0) x = rng(-9, 9);
            var y = rng(-9, 9);
            while (y == 0) y = rng(-9, 9);
            var cs = [];
            var coefficient;
            for (var i = 0; i < 4; i++) {
                coefficient = rng(-9, 9);
                while (coefficient == 0) coefficient = rng(-9, 9);
                cs.push(coefficient);
            }
            constants = [(cs[0]) * x + (cs[1]) * y, (cs[2]) * x + (cs[3]) * y]

            while (cs[0] / cs[2] == cs[1] / cs[3] && cs[0] / cs[2] == constants[0] / constants[1]) {
                cs = [];
                for (var i = 0; i < 4; i++) {
                    coefficient = rng(-9, 9);
                    while (coefficient == 0) coefficient = rng(-9, 9);
                    cs.push(coefficient);
                }
                constants = [(cs[0]) * x + (cs[1]) * y, (cs[2]) * x + (cs[3]) * y]
            }

            var eqs = [`${cs[0]}x+${cs[1]}y = ${constants[0]}`, `${cs[2]}x+${cs[3]}y = ${constants[1]}`]
            eqs = [eqs[0].replace('+-', '-'), eqs[1].replace('+-', '-')]
            const embed = new Discord.MessageEmbed()
                .setTitle("Solve this system of equations!")
                .setDescription(eqs[0] + '\n' + eqs[1])
                .setFooter(`Imagine knowing how to do this 🤡`)
            const m = await message.channel.send({ embeds: [embed]})
            const arr = [x, y]
            message.channel.awaitMessages(msg => msg.content && arr.includes(+msg.content), { max: 1, time: 300000 }).then(messages => {
                if (!messages.first()) return m.edit({ embeds: [embed.setTitle("Solve this system of equations! [expired]").setFooter(`Systems of equations expire after 5 minutes`).setColor("RED")]})
                const { member } = messages.first()
                const sol = parseInt(messages.first().content)
                remove(arr, sol)
                const des = `The value ${sol == x ? 'x' : 'y'} = ${sol} was solved by ${member.displayName}`
                m.edit({ embeds: [embed.setTitle("Solve this system of equation! [1/2 values solved]").setFooter("Wait, there is still another value left!")]})
                message.channel.send(`${member.toString()} congratulations! You solved the value of ${sol == x ? 'x' : 'y'} = ${sol} of the system [1 value left]!`)
                message.channel.awaitMessages(msg => msg.content && arr.includes(+msg.content), { max: 1, time: 300000 }).then(messages => {
                    if (!messages.first()) return m.edit({ embeds: [embed.setTitle("Solve this system of equation! [1/2 values solved]").setFooter(`Systems of equations expire after 5 minutes`).setColor("RED")]})
                    const { member } = messages.first()
                    const sol = parseInt(messages.first().content)
                    remove(arr, sol)
                    m.edit({ embeds: [embed.setTitle("Solve this system of equations! [2/2 values solved]").setFooter(`${des} and the value ${sol} was solved by ${member.displayName}!`)]})
                    message.channel.send(`${member.toString()} congratulations! You solved the value ${sol == x ? 'x' : 'y'} = ${sol} of the system!`)
                }).catch(console.error)
            }).catch(console.error)


        }
    },
}


