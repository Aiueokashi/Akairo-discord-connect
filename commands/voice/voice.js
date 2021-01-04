const { Command } = require('discord-akairo');
const request = require('node-superfetch');
const { Readable } = require('stream');
const { list, reactIfAble } = require('../../util/Util');
const voices = require('./../../assets/json/vocodes');

module.exports = class VocodesCommand extends Command {
	constructor() {
		super("vocodes", {
			aliases: ['vsay'],
      prefix:"ps!",
			args: [
				{
					key: 'text',
					type: 'string',
				}
			]
		});
	}

	async exec(msg, args) {
    const txt = args.text;
    const voice = "sonic";
		const connection = this.client.voice.connections.get(msg.guild.id);
		if (!connection) {
			return msg.reply(`\`ps!join\`を先に使用して下さい`);
		}
		try {
			await reactIfAble(msg, this.client.user,'💬', '💬');
			const { body } = await request
				.post('https://mumble.stream/speak_spectrogram')
				.send({
					speaker: voice,
					text
				});
			connection.play(Readable.from([Buffer.from(body.audio_base64, 'base64')]));
			await reactIfAble(msg, this.client.user, '🔉');
			return null;
		} catch (err) {
			await reactIfAble(msg, this.client.user, '⚠️');
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};