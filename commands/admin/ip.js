const {Command} = require('discord-akairo');
const request = require('node-superfetch');

module.exports = class IpCommand extends Command {
	constructor(client) {
		super('ip', {
		  aliases:['ip'],
			description: 'Responds with the IP address the bot\'s server is running on.',
			ownerOnly: true,
		});
	}

	async exec(msg) {
		const { body } = await request
			.get('https://api.ipify.org/')
			.query({ format: 'json' });
		await msg.channel.send(body.ip);
		return msg.channel.send('📬 Sent the IP address');
	}
};