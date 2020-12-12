const { Command } = require('discord-akairo');
const { stripIndents } = require('common-tags');
const validateflag = f => f === 'true' || f === 'false' || f === 'null';
const IGNORED = new Set([
  '762578988538396712',
  '760785560348000288',
  '760785560348000290',
  '760785560348000290',
  '761874820135649280',
  '763031667144392735',
  '763046577870471188',
  '763051458488172574',
  '763324743503708180',
  '760785560348000287'
])

module.exports = class LockCommand extends Command {
	constructor() {
		super('lockdown', {
			aliases: ['lockdown', 'ld', 'lock'],
			category: 'admin',
			description: 'lockdown guild,channel,user.',
      ownerOnly: true,
		});
	}

	async exec(msg) {
    const prefix = process.env.AUTO_PREFIX
    const [command, ...args] = msg.content.slice(prefix.length).split(' ');
    if(args.length !==2)
    return msg.channel.send(">>lockdown <roleID> TRUE | FALSE | NULL")
    let [ roleId, flag ] = args
    if(!isNaN(roleId) && validateflag(flag.toLowerCase())){
      flag = flag.toLowerCase() === "true" ? true: (flag.toLowerCase() === 'false' ? false: null);
      const lockchannels = msg.guild.channels.cache.filter(ch => ch.type === 'text');
      lockchannels.forEach(channel=>{
        if(!IGNORED.has(channel.id)){
          channel.updateOverwrite(roleId,{
            SEND_MESSAGES: !flag
          }).then(g => {console.log(`updatedrole${g.name}(${g.id})`);
          if(flag){
            if(g.name.endsWith('🔐')){
              g.edit({name:g.name+"🔐"});
            }else {
              g.edit({name:g.name.replace(/\s*🔐/,'')})
            }
          }
          })
          .catch(err => msg.channel.send("error:"+err));
        }else {
          console.log(`skipping${channel.name},${channel.id}`)
        }
      })
    }
    else{
      console.log("roleが見つかりません")
    }
    msg.channel.send("success")
	}
};