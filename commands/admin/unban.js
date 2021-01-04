const { Command } = require('discord-akairo');
const { inspect } = require('util');
const { stripIndents } = require('common-tags');
const path = require('path');
const owners = require('./owners');
const discord = require("discord.js")
module.exports = class UnbanCommand extends Command {
	constructor() {
		super('unban', {
			aliases: ['unban'],
			category: 'admin',
			description: 'unban command',
			ownerOnly: true,
			typing: false
		});
	}
      userPermissions(msg) {
    if (!owners.includes(msg.author.id)) {
        return 'operator';
    }
      return null;
    }
	exec(msg) {
		const prefix = process.env.AUTO_PREFIX;
		const [...args] = msg.content.slice(prefix.length + 4).split(' ');
		if (!args[0]) return;
		if (owners.includes(msg.author.id)) {
			msg.guild.members
				.unban(args[0])
				.then(
					user =>
						msg.channel.send(
							new discord.MessageEmbed()
								.setColor('BLUE')
								.setTitle('UNBANNED MEMBER(or USER)')
								.setDescription(
									`[**UN**BAN]:${user.tag || user.id || user}\n [MODERATOR]:${
										msg.author.tag
									}`
								)
								.setTimestamp()
						)
				)
				.catch(error=>msg.channel.send(error));
		}
	}
};
