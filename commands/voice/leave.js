const { Command } = require('discord-akairo');
module.exports = class LeaveCommand extends Command {
	constructor() {
		super('leave', {
			aliases: ['remove','leave'],
			category: 'voice',
			description: 'Leaves the current voice channel.',
			guildOnly: true,
			guarded: true,
			userPermissions: ['MOVE_MEMBERS']
		});
	}

async	exec(msg) {
		const connection = await msg.member.voice.channel.join();
		if (!connection) return msg.reply('そもそもせつぞくしてないyo');
		connection.channel.leave();
		return;
	}
};