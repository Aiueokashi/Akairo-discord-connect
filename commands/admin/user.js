const { Command } = require('discord-akairo');
const moment = require('moment-timezone');
const { MessageEmbed } = require('discord.js');
const { trimArray } = require('../../util/Util');
const flags = {
	DISCORD_EMPLOYEE: 'Discord Employee',
	PARTNERED_SERVER_OWNER: 'Discord Partner',
	BUGHUNTER_LEVEL_1: 'Bug Hunter (Level 1)',
	BUGHUNTER_LEVEL_2: 'Bug Hunter (Level 2)',
	HYPESQUAD_EVENTS: 'HypeSquad Events',
	HOUSE_BRAVERY: 'House of Bravery',
	HOUSE_BRILLIANCE: 'House of Brilliance',
	HOUSE_BALANCE: 'House of Balance',
	EARLY_SUPPORTER: 'Early Supporter',
	TEAM_USER: 'Team User',
	SYSTEM: 'System',
	VERIFIED_BOT: 'Verified Bot',
	EARLY_VERIFIED_DEVELOPER: 'Early Verified Bot Developer'
};
const deprecated = ['DISCORD_PARTNER', 'VERIFIED_DEVELOPER'];

module.exports = class UserCommand extends Command {
	constructor() {
		super('user', {
			aliases: ['user-fetch', 'memberf', 'member-fetch', 'userf'],
			description: 'Responds with detailed information on a user.',
      ownerOnly:false,
			/*args: [
				{
					key: 'member',
					prompt: {start:'tell me an user id'},
					type: 'member',
					default: msg => msg.author
				}
			]*/
		});
	}

  
  userPermissions(msg) {
    const operator = require("./operation")
    if (!operator.includes(msg.author.id)) {
        return 'operator';
    }
      return null;
    }

	async exec(msg) {
        const [command, ...args] = msg.content.slice(2).split(' ');
    var user;
			if (msg.mentions.users.first()) {
				user = msg.mentions.users.first();
			} else if(args[0]) {
				user = msg.guild.members.get(args[0]);
			}else {
        user = msg.author;
      }
    
	const userFlags = user.flags ? user.flags.toArray().filter(flag => !deprecated.includes(flag)) : [];
		const embed = new MessageEmbed()
			.setThumbnail(user.displayAvatarURL())
			.setAuthor(user.tag)
			.addField('❯ Discord Join Date', moment(user.createdAt).tz("Asia/Tokyo").format('MM/DD/YYYY h:mm A'), true)
			.addField('❯ ID', user.id, true)
			.addField('❯ Bot?', user.bot ? 'Yes' : 'No', true)
			.addField('❯ Flags', userFlags.length ? userFlags.map(flag => flags[flag]).join(', ') : 'None');
		if (msg.guild) {
			try {
				const member = await msg.guild.members.fetch(user.id);
				const defaultRole = msg.guild.roles.cache.get(msg.guild.id);
				const roles = member.roles.cache
					.filter(role => role.id !== defaultRole.id)
					.sort((a, b) => b.position - a.position)
					.map(role => role.name);
				embed
					.addField('❯ Server Join Date', moment(member.joinedAt).tz("Asia/Tokyo").format('MM/DD/YYYY h:mm A'), true)
					.addField('❯ Highest Role',	member.roles.highest.id === defaultRole.id ? 'None' : member.roles.highest.name, true)
					.addField('❯ Hoist Role', member.roles.hoist ? member.roles.hoist.name : 'None', true)
					.addField(`❯ Roles (${roles.length})`,`<@&${msg.guild.member(user)._roles.join('> <@&')}>`||'None')
					.setColor(member.displayHexColor);
			} catch {
				embed.setFooter('Failed to resolve member, showing basic user information instead.');
			}
		}
		return msg.channel.send(embed);
	}
};