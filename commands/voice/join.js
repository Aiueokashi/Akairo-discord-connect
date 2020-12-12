const { Command } = require('discord-akairo');
module.exports = class JoinCommand extends Command {
	constructor() {
		super('join', {
			aliases: ['join','shovel', 'join-vc', 'join-voice', 'join-channel'],
			category: 'voice',
			description: 'Joins your voice channel.',
			guildOnly: true,
			guarded: true,
			userPermissions: ['CONNECT']
		});
	}

	async exec(msg) {
		const voiceChannel = msg.member.voice.channel;
		if (!voiceChannel) return msg.reply('ボイスチャンネルに接続して下さい');
		if (!voiceChannel.permissionsFor(this.client.user).has(['CONNECT', 'SPEAK', 'VIEW_CHANNEL'])) {
			return msg.reply('permission missing');
		}
		if (!voiceChannel.joinable) return msg.reply('人数の上限に達しています');
		if (this.client.voice.connections.has(voiceChannel.guild.id)) {
			return msg.reply('already');
		}
		await voiceChannel.join();
		return;
	}
};