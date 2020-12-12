const { Command } = require('discord-akairo');
const moment = require('moment');
require('moment-timezone');
const { MessageEmbed } = require('discord.js');
module.exports = class RoleCommand extends Command {
	constructor() {
		super('role', {
			aliases: ['role-info','role-fetch','rolef'],
			description: 'Responds with detailed information on a role.',
			ownerOnly: true,
			args: [
				{
					key: 'role',
					prompt:{start: 'tell me a role id'},
					type: 'role'
				}
			]
		});
	}

	exec(msg) {
    const [command, ...args] = msg.content.slice(3).split(' ');
    	const role = msg.guild.roles.cache.get(args.join(' '));
		const embed = new MessageEmbed()
			.setColor(role.hexColor)
			.addField('❯ Name', role, true)
      .addField('❯ Color', role.hexColor.toUpperCase(), true)
			.addField('❯ ID', role.id, true)
			.addField('❯ Creation Date', moment(role.createdAt).tz("Asia/Tokyo").format('MM/DD/YYYY h:mm A'), true)
			.addField('❯ Hoisted?', role.hoist ? 'Yes' : 'No', true)
			.addField('❯ Mentionable?', role.mentionable ? 'Yes' : 'No', true)
//.addField('❯ Permissions', role.permissionNames().join(', ') || 'None');
	msg.channel.send(embed);
	}
};