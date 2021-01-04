require('dotenv').config();
const eventID = 7;
const { AUTO_TOKEN, AUTO_PREFIX, OWNERS, INVITE, DB_PASS, DB_NAME } = process.env;
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
const Canvas = require('canvas');
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
/*const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const assert = require('assert')
const connectOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}
MongoClient.connect(`mongodb+srv://${DB_NAME}:${DB_PASS}@cluster0.kghis.gcp.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`, connectOptions, (err, mongodb) => {
    var collection;
    const mdb = mongodb.db(DB_NAME);
    // コレクションの取得
    collection = mdb.collection("products");
 
    collection.find().toArray((error, documents) => {
        for (var document of documents) {
            console.log(document.name);
        }
    });
    mongodb.close();
})*/

cron.schedule('5,26,35 * * * *', async () => {
  const info = await Util.fetchData("https://raw.githubusercontent.com/Sekai-World/sekai-master-db-diff/master/userInformations.json")

  let plat = {
    Android: 'アンドロイド📱',
    iOS: 'iOS📱',
    all: 'iOS,アンドロイド📱'
  }
  let type = {
    bug: 'バグ報告📵',
    information: 'インフォメーションℹ️',
    update: 'アップデート情報⬆️',
    campaign: 'キャンペーン🎊',
    gacha: 'ガチャ📤',
    event: 'イベント情報🏆',
    music: '楽曲情報💿'
  }
  db.get(`fullinfo_now`).then(async v => {
    if (v != info) {
      const diff = jsondiffpatch.diff(v, info);
      const reach = diff.length;
      for (let i; i < diff.length; i++) {
        var embed = new discord.MessageEmbed()
          .setTitle(`Info: ${diff[i].title}`)
          .setURL(`https://production-web.sekai.colorfulpalette.org/${diff[i].path}`)
          .addField("通知タイプ:", `${type[diff[i].informationTag]}`)
          .addField("通知端末:", `${plat[diff[i].platform]}`)
          .addField('通知日時詳細:', `${humanizer()(Date.now() - diff[i].startAt)}前の通知`)
        const ichannel = await client.channels.fetch("766162642682511400");
        ichannel.send(
          embed.setTimestamp(diff[i].startAt).setFooter('お知らせ時刻:')
        );
        db.set(`fullinfo_now`, info).then(() => { })
        console.log("send");
      }
    } else {
      console.log("skipped")
    }
  })

})

client.setup();

client.on('message', msg => runLint(msg));

client.on('messageUpdate', (oldMsg, msg) => runLint(msg));
const sendtime = {}
client.on('ready', async () => {
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
  let status;
  const eventTracker = await Util.fetchData(`https://bitbucket.org/sekai-world/sekai-event-track/raw/f335a3f5c401b4e3b0aad27bec3573f00c3682cf/event7.json`)
  client.logger.info(`[READY] Logged in as ${client.user.tag}! ID: ${client.user.id}`);
  if (Date.now() < event[event.length - 1]["startAt"]) {
    status = Date.now() < event[event.length - 2]["aggregateAt"] ? `イベント終了まで: ${humanizer({ round: true })(Date.now() - event[event.length - 2]["aggregateAt"])}` : '開催中のイベント無し';
  } else {
    status = Date.now() < event[event.length - 1]["aggregateAt"] ? `イベント終了まで: ${humanizer({ round: true })(Date.now() - event[event.length - 1]["aggregateAt"])}` : '開催中のイベント無し';
  }
  client.user.setActivity(status, { type: "PLAYING" });

  client.setInterval(async () => {
    const eventTracker = await Util.fetchData(`https://bitbucket.org/sekai-world/sekai-event-track/raw/f335a3f5c401b4e3b0aad27bec3573f00c3682cf/event7.json`)
    //const activity = activities[Math.floor(Math.random() * activities.length)];
    if (Date.now() < event[event.length - 1]["startAt"]) {
      status = Date.now() < event[event.length - 2]["aggregateAt"] ? `イベント終了まで: ${humanizer({ round: true })(Date.now() - event[event.length - 2]["aggregateAt"])}` : '開催中のイベント無し';
    } else {
      status = Date.now() < event[event.length - 1]["aggregateAt"] ? `イベント終了まで: ${humanizer({ round: true })(Date.now() - event[event.length - 1]["aggregateAt"])}` : '開催中のイベント無し';
    }
    client.user.setActivity(status, { type: "PLAYING" });
  }, 30000)
});

client.on('guildMemberAdd', async member => {
  const canvas = Canvas.createCanvas(1200, 675);
  const ctx = canvas.getContext('2d');

  const imglist = new Array(
    './assets/images/image1.jpg',
    './assets/images/image2.jpg',
    './assets/images/image3.jpg',
    './assets/images/image4.jpg',
    './assets/images/image5.jpg'
  );
  const selectnum = Math.floor(Math.random() * imglist.length);

  const background = await Canvas.loadImage(imglist[selectnum]);

  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = '#74037b';
  ctx.strokeRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.arc(250, 250, 200, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.clip();

  const avatar = await Canvas.loadImage(
    member.user.displayAvatarURL({ format: 'jpg' })
  );
  ctx.drawImage(avatar, 50, 50, 400, 400);

  const attachment = new discord.MessageAttachment(
    canvas.toBuffer(),
    'welcome-image.png'
  );

  let welcomeembed = new discord.MessageEmbed()
    .setColor('RANDOM')
    .setTitle(`${member.displayName}さんよろしく！`)
    .setDescription(
      `<@!${member.id}>が参加したよー、よろ<@&${'762205538418688041'}>!!`
    )
    .setFooter('from:プロセカサーバー');

  let welcomeembed2 = new discord.MessageEmbed()
    .setColor('RANDOM')
    .setTitle(`${member.displayName}さんようこそ！`)
    .setDescription(
      `<@!${
      member.id
      }>さん!ようこそプロジェクトセカイサーバーへ!!まずは <#${`760785558296330264`}> をよんで自己紹介して認証してね！`
    )
    .setFooter('from:プロセカサーバー');

  client.channels.cache.get('780311888814800916').send(welcomeembed);
  client.channels.cache.get('760785557927755794').send(welcomeembed2);
  client.channels.cache.get('780311888814800916').send(attachment);
  client.channels.cache.get('760785557927755794').send(attachment);
  member.roles.add('782555374820524062');
  console.log('sucsess!!');
})

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