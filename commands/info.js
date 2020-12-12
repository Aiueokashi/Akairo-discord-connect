const { Command } = require('discord-akairo');
const cron = require('node-cron')
const { humanizer } = require('humanize-duration');
const Util = require('../util/Util');
const Discord = require('discord.js');

module.exports = class EvalCommand extends Command {
	constructor() {
		super('info', {
			aliases: ['info','getinfo'],
			category: 'admin',
			args:[
        {
          id: 'items',
          match: 'content',
          prompt: {
            start: 'Please tell me an info id'
          }
        }
      ],
			ownerOnly: true,
			typing: false
		});
	}

	async exec(msg,args) {
	  let infoID = args.items;
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
	   const pageinfo = await Util.txfetchData(`https://production-web.sekai.colorfulpalette.org/${info[infoID].path}`)
	     const embed = new Discord.MessageEmbed()
        .setTitle(`Info: ${info[infoID].title}`)
        .setURL(`https://production-web.sekai.colorfulpalette.org/${info[infoID].path}`)
       // .setDescription(pageinfo)
       .addField("通知タイプ:",`${type[info[infoID].informationTag]}`)
       .addField("通知端末:",`${plat[info[infoID].platform]}`)
        .addField('通知日時詳細:',`${humanizer()(Date.now()-info[infoID].startAt)}前の通知`)
      msg.channel.send(
        embed.setTimestamp(info[infoID].startAt).setFooter('お知らせ時刻:')
      );
	}
};
