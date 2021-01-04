const {Command} = require('discord-akairo');
const { createCanvas, loadImage, registerFont } = require('canvas');
const request = require('node-superfetch');
const path = require('path');
const { greyscale } = require('../../util/Canvas');
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'setofont.ttf'), { family: 'Coffin Stone' });

module.exports = class RipCommand extends Command {
	constructor() {
		super('rip', {
			aliases: ['grave', 'grave-stone','rip'],
		});
	}

	async exec(msg) {
	  const [command, ...args] = msg.content.slice(2).split(' ');
	  let user = msg.mentions.users.first();
    let cause = "";
	  for(let i = 1; i <args.length;i++){
      cause = cause + args[i] + " "
    }
		const avatarURL = user.displayAvatarURL({ format: 'png', size: 512 });
		try {
			const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'rip.png'));
			const { body } = await request.get(avatarURL);
			const avatar = await loadImage(body);
			const canvas = createCanvas(base.width, base.height);
			const ctx = canvas.getContext('2d');
			ctx.drawImage(base, 0, 0);
			ctx.drawImage(avatar, 194, 399, 500, 500);
			greyscale(ctx, 194, 399, 500, 500);
			ctx.textBaseline = 'top';
			ctx.textAlign = 'center';
			ctx.font = '62px Coffin Stone';
			ctx.fillStyle = 'black';
			ctx.fillText(user.username, 438, 330, 500);
			ctx.fillStyle = 'white';
			if (cause) ctx.fillText(cause, 438, 910, 500);
			ctx.font = '37px Coffin Stone';
			ctx.fillText('RIP', 438, 292);
			return msg.channel.send({ files: [{ attachment: canvas.toBuffer(), name: 'rip.png' }] });
		} catch (err) {
			return msg.reply(`ERROR: \`${err.message}\`.`);
		}
	}
};