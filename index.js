require('dotenv').config();
const eventID = 6;
const { AUTO_TOKEN, AUTO_PREFIX, OWNERS, INVITE } = process.env;
const Client = require('./structures/Client');
const client = new Client({
  partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
	prefix: AUTO_PREFIX,
	ownerID: OWNERS.split(','),
	disableEveryone: true,
	disabledEvents: []
});
const { Readable } = require('stream');
const jsondiffpatch = require('jsondiffpatch');
const cron = require('node-cron')
const { humanizer } = require('humanize-duration');
const nodesuperfetch = require('node-superfetch');
const Util = require('./util/Util');
const Database = require("@replit/database")
const db = new Database()
const discord = require('discord.js')
const activities = require('./assets/json/activity');
const { stripIndents } = require('common-tags');
const fetch = require('node-fetch');
const codeblock = /```(?:(\S+)\n)?\s*([^]+?)\s*```/i;
const runLint = msg => {
	if (msg.channel.type !== 'text' || msg.author.bot) return null;
	if (!codeblock.test(msg.content)) return null;
	if (!msg.channel.permissionsFor(msg.client.user).has(['ADD_REACTIONS', 'READ_MESSAGE_HISTORY'])) return null;
	const parsed = codeblock.exec(msg.content);
	const code = {
		code: parsed[2],
		lang: parsed[1] ? parsed[1].toLowerCase() : null
	};
	return client.commandHandler.modules.get('lint')/*.exec(msg, { code, amber: false }, true);*/
};

cron.schedule('5,26,35 * * * *', async () => {
  	   const info = await Util.fetchData("https://raw.githubusercontent.com/Sekai-World/sekai-master-db-diff/master/userInformations.json")
	   
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
	db.get(`fullinfo_now`).then(async v=> {
	  if(v != info){
	    const diff = jsondiffpatch.diff(v, info);
	    const reach = diff.length;
	    for(let i; i < diff.length; i++){
	   var embed = new discord.MessageEmbed()
        .setTitle(`Info: ${diff[i].title}`)
        .setURL(`https://production-web.sekai.colorfulpalette.org/${diff[i].path}`)
       .addField("通知タイプ:",`${type[diff[i].informationTag]}`)
       .addField("通知端末:",`${plat[diff[i].platform]}`)
        .addField('通知日時詳細:',`${humanizer()(Date.now()-diff[i].startAt)}前の通知`)
        const ichannel = await client.channels.fetch("766162642682511400");
      ichannel.send(
        embed.setTimestamp(diff[i].startAt).setFooter('お知らせ時刻:')
      );
	   db.set(`fullinfo_now`,info).then(()=>{})
	    console.log("send");
	    }
	  }else{
	    console.log("skipped")
	  }
	})

})

client.setup();

client.on('message', msg => runLint(msg));

client.on('messageUpdate', (oldMsg, msg) => runLint(msg));
const sendtime = {}
client.on('ready', async() => {
    sendtime[client.channels.cache.get('766162642682511400')] = Date.now();
	const logchannel = client.channels.cache.get('766162642682511400');
	logchannel.send('pinging...').then(function(t) {
		t.edit(
			new discord.MessageEmbed()
				.setColor("RED")
				.setTitle('再起動')
				.setDescription(
					`ping:${Date.now() -
						sendtime[client.channels.cache.get('766162642682511400')]} ms`
				)
				.setFooter(`${client.user.tag} ディレクトリ:Akairo-discord`)
		);
	});
  sendtime[client.channels.cache.get('777400049893113876')] = Date.now();
	const logchannel2 = client.channels.cache.get('777400049893113876');
	logchannel2.send('pinging...').then(function(t) {
		t.edit(
			new discord.MessageEmbed()
				.setColor('RED')
				.setTitle('再起動')
				.setDescription(
					`ping:${Date.now() -
						sendtime[client.channels.cache.get('777400049893113876')]} ms`
				)
				.setFooter(`${client.user.tag} ディレクトリ:ManagementSystem(管理部分)`)
		);
	});
  const event = await Util.fetchData("https://raw.githubusercontent.com/Sekai-World/sekai-master-db-diff/master/events.json")
  let status ;
  const eventTracker = await Util.fetchData(`https://bitbucket.org/sekai-world/sekai-event-track/raw/f335a3f5c401b4e3b0aad27bec3573f00c3682cf/event7.json`)
	client.logger.info(`[READY] Logged in as ${client.user.tag}! ID: ${client.user.id}`);
  status = Date.now() <  event.slice(-1)[0].aggregateAt ? `イベント終了まで: ${humanizer()(Date.now() - event.slice(-1)[0].aggregateAt)}` : '開催中のイベント無し';
  client.user.setActivity(status, { type: "PLAYING" });
  let ch = client.channels.cache.get("786953511182401566")
  ch.messages.fetch("787107937839218720").then(message => message.edit(new discord.MessageEmbed()
        .setTitle(`イベント名: ${event[eventID].name}  |  Rank:#100`)
        .setThumbnail(`https://sekai-res.dnaroma.eu/file/sekai-assets/home/banner/${event[eventID].assetbundleName}_rip/${event[eventID].assetbundleName}.webp`)
        .addField(`スコア:`,`${eventTracker["rank100"][0].score}`,true)
        .addField(`ユーザー名:`,`${eventTracker["rank100"][0].name}`,true)
        .addField(`一言`,`${eventTracker["rank100"][0]["userProfile"].word}`)))
  .catch(console.error);
  ch.messages.fetch("787106577122983998").then(message => message.edit(new discord.MessageEmbed()
        .setTitle(`イベント名: ${event[eventID].name}  |  Rank:#2`)
        .setThumbnail(`https://sekai-res.dnaroma.eu/file/sekai-assets/home/banner/${event[eventID].assetbundleName}_rip/${event[eventID].assetbundleName}.webp`)
        .addField(`スコア:`,`${eventTracker["first10"][1].score}`,true)
        .addField(`ユーザー名:`,`${eventTracker["first10"][1].name}`,true)
        .addField(`一言`,`${eventTracker["first10"][1]["userProfile"].word}`)))
  .catch(console.error);
    ch.messages.fetch("786954102830792715").then(message => message.edit(new discord.MessageEmbed()
        .setTitle(`イベント名: ${event[eventID].name}  |  Rank:#1`)
        .setThumbnail(`https://sekai-res.dnaroma.eu/file/sekai-assets/home/banner/${event[eventID].assetbundleName}_rip/${event[eventID].assetbundleName}.webp`)
        .addField(`スコア:`,`${eventTracker["first10"][0].score}`,true)
        .addField(`ユーザー名:`,`${eventTracker["first10"][0].name}`,true)
        .addField(`一言`,`${eventTracker["first10"][0]["userProfile"].word}`)))
  .catch(console.error);
  	client.setInterval(async () => {
    const eventTracker = await Util.fetchData(`https://bitbucket.org/sekai-world/sekai-event-track/raw/f335a3f5c401b4e3b0aad27bec3573f00c3682cf/event7.json`)
    const events = await Util.fetchData("https://raw.githubusercontent.com/Sekai-World/sekai-master-db-diff/master/events.json")
		//const activity = activities[Math.floor(Math.random() * activities.length)];
    let ch = client.channels.cache.get("786953511182401566")
    ch.messages.fetch("786954102830792715").then(message => message.edit(new discord.MessageEmbed()
        .setTitle(`イベント名: ${event[eventID].name}  |  Rank:#1`)
        .setThumbnail(`https://sekai-res.dnaroma.eu/file/sekai-assets/home/banner/${event[eventID].assetbundleName}_rip/${event[eventID].assetbundleName}.webp`)
        .addField(`スコア:`,`${eventTracker["first10"][0].score}`,true)
        .addField(`ユーザー名:`,`${eventTracker["first10"][0].name}`,true)
        .addField(`一言`,`${eventTracker["first10"][0]["userProfile"].word}`)))
  .catch(console.error);
  ch.messages.fetch("787106577122983998").then(message => message.edit(new discord.MessageEmbed()
        .setTitle(`イベント名: ${event[eventID].name}  |  Rank:#2`)
        .setThumbnail(`https://sekai-res.dnaroma.eu/file/sekai-assets/home/banner/${event[eventID].assetbundleName}_rip/${event[eventID].assetbundleName}.webp`)
        .addField(`スコア:`,`${eventTracker["first10"][1].score}`,true)
        .addField(`ユーザー名:`,`${eventTracker["first10"][1].name}`,true)
        .addField(`一言`,`${eventTracker["first10"][1]["userProfile"].word}`)))
  .catch(console.error);
  ch.messages.fetch("787107937839218720").then(message => message.edit(new discord.MessageEmbed()
        .setTitle(`イベント名: ${event[eventID].name}  |  Rank:#100`)
        .setThumbnail(`https://sekai-res.dnaroma.eu/file/sekai-assets/home/banner/${event[eventID].assetbundleName}_rip/${event[eventID].assetbundleName}.webp`)
        .addField(`スコア:`,`${eventTracker["rank100"][0].score}`,true)
        .addField(`ユーザー名:`,`${eventTracker["rank100"][0].name}`,true)
        .addField(`一言`,`${eventTracker["rank100"][0]["userProfile"].word}`)))
  .catch(console.error);
		client.user.setActivity(Date.now() <  events.slice(-1)[0].aggregateAt ? `イベント終了まで: ${humanizer()(Date.now() - events.slice(-1)[0].aggregateAt)}` : '開催中のイベント無し', { type: "PLAYING" });
	}, 30000)
});

client.on('disconnect', event => {
	client.logger.error(`[DISCONNECT] Disconnected with code ${event.code}.`);
	process.exit(0);
});

client.on('error', err => client.logger.error(err));

client.on('warn', warn => client.logger.warn(warn));

client.commandHandler.on('error', (err, msg, command) => {
	client.logger.error(`[COMMAND${command ? `:${command.name}` : ''}]\n${err.stack}`);
	msg.reply(stripIndents`
		コマンドを実行中に~~深刻な~~エラーが発生しました: \`${err.message}\`exit...`).catch(() => null);
});

client.login(AUTO_TOKEN);