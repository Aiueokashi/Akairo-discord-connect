const { Command } = require('discord-akairo');
const request = require('node-superfetch');
require('avconv')
const { Readable } = require('stream');
const { reactIfAble , shorten } = require('../../util/Util');
const ffmpeg = require('ffmpeg-static')


module.exports = class DECTalkCommand extends Command {
	constructor() {
		super('say', {
			aliases: ['say','tts'],
			category: 'voice',
			description: 'The world\'s best Text-to-Speech.',
			guildOnly: true,
			userPermissions: ['CONNECT', 'SPEAK'],
      args: [
				{
					key: 'text',
					prompt:{start: '読み上げる文字を入力してください'},
					type: 'string',
				}
			]
		});
	}

	async exec(msg,{text}) {
	const prefix = process.env.AUTO_PREFIX
  const args = msg.content.slice(prefix.length+3).split(' ')
		const connection = await msg.member.voice.channel.join();
		if (!connection) {
msg.reply(`${prefix}joinを先に使用してください`)
		}
		try {
    await reactIfAble(msg, this.client.user, ':warning:', '💬');
			const { body } = await request
				.get('http://tts.cyzon.us/tts')
				.query({ text });
			connection.play(shorten(Readable.from([body])));
			await reactIfAble(msg, this.client.user, '🔉');
			return null;
		} catch (err) {
			return msg.reply(`読み上げの際にエラーが発生しました: \`${err.message}\``);
		}
	}
};