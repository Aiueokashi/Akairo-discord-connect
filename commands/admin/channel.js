const {Command} = require('discord-akairo');
const moment = require('moment');
const { MessageEmbed } = require('discord.js');

const discord = require("discord.js")
const client = new discord.Client();
const types = {
	dm: 'DM',
	group: 'Group DM',
	text: 'Text Channel',
	voice: 'Voice Channel',
	category: 'Category',
	unknown: 'Unknown'
};

module.exports = class ChannelCommand extends Command {
	constructor() {
		super('channel', {
			aliases: ['channel-fetch','channelf'],
			description: 'Responds with detailed information on a channel.',
		});
	}

  userPermissions(msg) {
    const operator = require("./operation")
    if (!operator.includes(msg.author.id)) {
        return 'operator';
    }
      return null;
    }

	exec(msg) {
	   const [command, ...args] = msg.content.slice(2).split(' ');
    	const channel = msg.mentions.channels.first() || msg.channel
		const embed = new MessageEmbed()
			.setColor(0x00AE86)
			.addField('❯ Name', channel.type === 'dm' ? `@${channel.recipient.username}` : channel.name, true)
			.addField('❯ ID', channel.id, true)
			.addField('❯ NSFW', channel.nsfw ? 'Yes' : 'No', true)
			.addField('❯ Category', channel.parent ? channel.parent.name : 'None', true)
			.addField('❯ Type', types[channel.type], true)
			.addField('❯ Creation Date', moment.utc(channel.createdAt).format('MM/DD/YYYY h:mm A'), true)
			.addField('❯ Topic', channel.topic || 'None');
		return msg.channel.send(embed);
	}
};