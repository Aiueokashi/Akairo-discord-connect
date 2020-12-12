const { Command } = require('discord-akairo');
const { inspect } = require('util');
const { stripIndents } = require('common-tags');
const path = require('path');
const owners = require('./owners');
const discord = require('discord.js');
client = new discord.Client();
module.exports = class EvalCommand extends Command {
	constructor() {
		super('ban', {
			aliases: ['ban'],
			category: 'admin',
			description: 'ban command',
			ownerOnly: true,
			typing: false
		});
	}
	exec(msg) {
		const prefix = process.env.AUTO_PREFIX;
		const [...args] = msg.content.slice(prefix.length + 4).split(' ');
		if (!args[0]) return;
		if (!args[1]) return;
		if (owners.includes(msg.author.id)) {
			msg.guild.members
				.ban(args[0])
				.then(
					user =>
						msg.channel.send(
							new discord.MessageEmbed()
								.setColor('RED')
								.setTitle('BANNED MEMBER(or USER)')
								.setDescription(
									`[BAN]:${user.tag || user.id || user}\n [MODERATOR]:${
										msg.author.tag
									}`
								)
								.addField(`[REASON]:`, args[1])
								.setTimestamp()
						)
				)
				.catch(console.error);
		}
	}
};
