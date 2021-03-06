const { Command } = require('discord-akairo');
const request = require('node-superfetch');
const { Readable } = require('stream');
const { reactIfAble } = require('../../util/Util');

module.exports = class SayCommand extends Command {
	constructor() {
		super("say", {
			aliases: ['say'],
      prefix:"ps!",
			description: 'test-to-speak',
			args: [
				{
					key: 'text',
					type: 'string'
				}
			]
		});
	}

	async exec(msg,args) {
    const txt = args.text
		const connection = this.client.voice.connections.get(msg.guild.id);
		if (!connection) {
			return msg.reply(`\`ps!join\`を先に使用して下さい`);
		}
		try {
			await reactIfAble(msg, this.client.user, "thinking", '💬');
			const { body } = await request
				.get('http://tts.cyzon.us/tts')
				.query({ txt });
			connection.play(Readable.from([body]));
			await reactIfAble(msg, this.client.user, '🔉');
			return null;
		} catch (err) {
			await reactIfAble(msg, this.client.user, '⚠️');
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};