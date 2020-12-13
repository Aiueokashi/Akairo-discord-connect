const { Command } = require('discord-akairo');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
module.exports = class AvatarFusionCommand extends Command {
	constructor() {
		super('avatar-fusion', {
			aliases: ['avatar-fuse', 'ava-fuse','avafuse'],
			description: 'アバター重ね書き',
      channel:"guild"
		});
	}

	async exec(msg) {
    const [command, ...args] = msg.content.slice(2).split(' ');
    let base = msg.guild.member(client.users.cache.get(args[0]));
    let overlay =  msg.guild.member(client.users.cache.get(args[1]));
		const baseAvatarURL = await base.displayAvatarURL({ format: 'png', size: 512, dynamic:true });
		const overlayAvatarURL =  await overlay.displayAvatarURL({ format: 'png', size: 512, dynamic:true });
		try {
			const baseAvatarData = await request.get(baseAvatarURL);
			const baseAvatar = await loadImage(baseAvatarData.body);
			const overlayAvatarData = await request.get(overlayAvatarURL);
			const overlayAvatar = await loadImage(overlayAvatarData.body);
			const canvas = createCanvas(baseAvatar.width, baseAvatar.height);
			const ctx = canvas.getContext('2d');
			ctx.globalAlpha = 0.5;
			ctx.drawImage(baseAvatar, 0, 0);
			ctx.drawImage(overlayAvatar, 0, 0, baseAvatar.width, baseAvatar.height);
			return msg.channel.send({ files: [{ attachment: canvas.toBuffer(), name: 'avatar-fusion.png' }] });
		} catch (err) {
		return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};