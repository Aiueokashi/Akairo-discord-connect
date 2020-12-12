const http = require('http');
http
	.createServer(function(req, res) {
		res.write('動いてりゅよฅ(＾・ω・＾ฅ)');
		res.end();
	})
	.listen(8080);
const { AkairoClient, CommandHandler, InhibitorHandler, ListenerHandler } = require('discord-akairo');
const { stripIndents } = require('common-tags');
const winston = require('winston');
const path = require('path');
const CodeType = require('../types/code');

class Client extends AkairoClient {
    constructor() {
        super({
            ownerID: ["475304856018616340","540430822235439114","700682419925155892","489012602182041601"], 
        }, {
            disableMentions: 'everyone'
        });
        this.commandHandler = new CommandHandler(this, {
        directory: './commands/',
        prefix: [">>"],
        allowMention: true,
        handleEdits: true,
        commandUtil: true,
			  commandUtilLifetime: 60000,
			  fetchMembers: true,
			  defaultCooldown: 1000,
			  defaultPrompt: {
				modifyStart: (text, msg) => stripIndents`
					${msg.author}, ${text}
					Respond with \`cancel\` to cancel the command. The command will automatically be cancelled in 30 seconds.
				`,
				modifyRetry: (text, msg) => stripIndents`
					${msg.author}, ${text}
					Respond with \`cancel\` to cancel the command. The command will automatically be cancelled in 30 seconds.
				`,
				timeout: msg => `${msg.author}, cancelled command.`,
				ended: msg => `${msg.author}, 2 tries and you still don't understand, cancelled command.`,
				cancel: msg => `${msg.author}, cancelled command.`,
				retries: 2,
				stopWord: 'finish'
			}
        });
      this.logger = winston.createLogger({
			transports: [new winston.transports.Console()],
			format: winston.format.combine(
			winston.format.timestamp({ format: 'MM/DD/YYYY HH:mm:ss' }),
		  winston.format.printf(log => `[${log.timestamp}] [${log.level.toUpperCase()}]: ${log.message}`)
		  )});
      
      this.inhibitorHandler = new InhibitorHandler(this, {
      directory: './inhibitors/'
        });

      this.listenerHandler = new ListenerHandler(this, {
      directory: '../listeners/'
      });
    }
    setup() {
		this.commandHandler.loadAll();
		this.commandHandler.resolver.addType('code', CodeType);
	}
    
}
module.exports = Client;