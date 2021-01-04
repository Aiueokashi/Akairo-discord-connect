const { Command } = require('discord-akairo');
const { inspect } = require('util');
const { stripIndents } = require('common-tags');
const path = require('path');
const owners = require('./owners');
const discord = require("discord.js")
module.exports = class ForEachBanCommand extends Command {
	constructor() {
		super('loopBan', {
			aliases: ['loopBan'],
			category: 'admin',
			description: 'forEach ban command',
			ownerOnly: true,
			typing: false
		});
	}
	exec(msg) {
		const prefix = process.env.AUTO_PREFIX;
		const [...args] = msg.content.slice(prefix.length + 7).split(' ');
    for (let i = 0; i < args.length; i++){
      if(owners.includes(args[i])){
        return msg.channel.send("この人はbanできません。処理を強制終了します。")
      }
      if (owners.includes(msg.author.id)){
      msg.guild.members
				.ban(args[i],{reason:`loop Bans`})
				.then(
					user =>
						msg.channel.send(
							new discord.MessageEmbed()
								.setColor('RED')
								.setTitle('LOOP BANNED MEMBER(or USER)')
								.setDescription(
									`[BAN]:${user.tag || user.id || user}\n [MODERATOR]:${
										msg.author.tag
									}`
								)
								.setTimestamp()
						)
				)
      }
    }

	}
};
