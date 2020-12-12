const { Command } = require('discord-akairo');
const cron = require('node-cron')
const { humanizer } = require('humanize-duration');
const Util = require('../util/Util');
const Discord = require('discord.js');

module.exports = class EvalCommand extends Command {
	constructor() {
		super('lastinfo', {
			aliases: ['lastinfo'],
			category: 'admin',
			ownerOnly: true,
			typing: false
		});
	}

	async exec(msg) {
	  	let plat = {
	  Android:'アンドロイド📱',
	  iOS:'iOS📱',
	  all:'iOS,アンドロイド📱'
	}
	let type= {
	  bug:'バグ報告📵',
	  information:'インフォメーションℹ️',
	  update:'アップデート情報⬆️',
	  campaign:'キャンペーン🎊',
	  gacha:'ガチャ📤',
	  event:'イベント情報🏆',
	  music:'楽曲情報💿'
	  
	}
	   const info = await Util.fetchData("https://raw.githubusercontent.com/Sekai-World/sekai-master-db-diff/master/userInformations.json")
	     const embed = new Discord.MessageEmbed()
        .setTitle(`Info: ${info.slice(-1)[0].title}`)
        .setURL(`https://production-web.sekai.colorfulpalette.org/${info.slice(-1)[0].path}`)
       .addField("通知タイプ:",`${type[info.slice(-1)[0].informationTag]}`)
       .addField("通知端末:",`${plat[info.slice(-1)[0].platform]}`)
        .addField('通知日時詳細:',`${humanizer()(Date.now()-info.slice(-1)[0].startAt)}前の通知`)
      msg.channel.send(
        embed.setTimestamp(info.slice(-1)[0].startAt).setFooter('お知らせ時刻:')
      );
	}
};
