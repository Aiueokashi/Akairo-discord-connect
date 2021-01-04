const { Command } = require('discord-akairo');
const { inspect } = require('util');
const { stripIndents } = require('common-tags');
const path = require('path');
const owners = require('./owners');
const discord = require('discord.js')

const reactfilter = (reaction, user) => user.id === message.author.id && reaction.emoji.name === '❎'
module.exports = class EvalCommand extends Command {
	constructor() {
		super('eval', {
			aliases: ['eval'],
			category: 'admin',
			description: 'evaluate command',
      ownerOnly: true,
      typing:true,
      cooldown:2000,
		});
	}
async exec(msg) {
  const prefix = process.env.AUTO_PREFIX
  const args = msg.content.slice(prefix.length+4).split(' ')
  	if (owners.includes(msg.author.id)) {
		let evaled;
		var message = msg;
		var sourceStr = msg.content;
		var code = sourceStr.slice(prefix.length+4);
		try {
			evaled = await eval(args.join(' '));
			msg.react('✅');
		} catch (error) {
			var errormsg = msg.channel.send({
				embed: {
					color: 0x00ae86,
					title: 'ERROR',
					description: 'コード```javascript\n' + code + '```ERROR内容```' + error + '```'
				}
			});
			msg.react('❎');
		}
	} else {
		console.log(`${msg.author.name}がevalを使おうと試みて失敗したよ`);
	}
}
};