const discord = require('discord.js'),
    bot = new discord.Client({ disableEveryone: true }),
    db = require('quick.db'),
    prefix = "a!",
    talkedRecently = new Set(),
    specialUsersIGuess = ['450632557290061824', '161973479858503680', '289027962232242176', '146078184260108288']

bot.on('ready', event => {
    console.log("I'm ready!");
    bot.user.setPresence({game: { name: "people get pinged", type: "WATCHING" } })
})

bot.on('message', msg => {
    if (msg.author.bot) return;
    const user = msg.mentions.users.first();
    if (user) {
        db.fetch(`away_${user.id}`).then(i=>{
            if (i) {
                //console.log(specialUsersIGuess.includes(user.id))
                if (!specialUsersIGuess.includes(user.id)) {
                    const embed = new discord.RichEmbed()
                        .setTitle(`${user.username} is away`)
                        .setDescription(i)
                        .setColor("RED");
                    msg.channel.send(embed);
                } else {
                    const niceEmbed = new discord.RichEmbed()
                        .setTitle(`${user.username} IS FRICKING AWAY!!31!1!1`)
                        .setDescription(`<:pingsock:434187893721006080><a:angeryping:452051400613036062><:pingsock:434187893721006080>       <:pingsock:434187893721006080><a:angeryping:452051400613036062><:pingsock:434187893721006080>\n\n${i}`)
                        .setColor('RED')
                    msg.channel.send(niceEmbed)
                    return;
                }
            }
        })
    }
    if (!msg.content.startsWith(prefix)) return;
    if(msg.channel.type !== 'text') return sendEmbed("Please use this bot in a guild text channel.", msg.channel);
    const args = msg.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    if(command === 'afk') {
        db.fetch(`away_${msg.author.id}`).then(i => {
            if(i) {
                db.delete(`away_${msg.author.id}`).then(i => {
                    sendEmbed("You are no longer AFK.", msg.channel);
                })
            } else {
                let message = args.join(' ') || `${msg.author.username} is away.`;
                if (message.length > 150 && !specialUsersIGuess.includes(msg.author.id)) return sendEmbed('message is too long!', msg.channel);
                //if (msg.author.id === '468361542728155139') return msg.reply('no u');
                db.set(`away_${msg.author.id}`, message).then(i => {
                    sendEmbed("You are now AFK.", msg.channel);
                })
            }
        })
    }
})

function sendEmbed(message, channel) {
    const embed = new discord.RichEmbed()
        .setDescription(message)
        .setColor('RANDOM');
    channel.send(embed);
}

bot.login("YOUR TOKEN HERE")