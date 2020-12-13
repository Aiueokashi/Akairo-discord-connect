const fetch = require('node-fetch');
class Util {
	static shorten(text, maxLen = 2000) {
		return text.length > maxLen ? `${text.substr(0, maxLen - 3)}...` : text;
	}

	static trimArray(arr, maxLen = 10) {
		if (arr.length > maxLen) {
			const len = arr.length - maxLen;
			arr = arr.slice(0, maxLen);
			arr.push(`${len} more...`);
		}
		return arr;
	}
	static firstUpperCase(text) {
		return `${text.charAt(0).toUpperCase()}${text.slice(1)}`;
	}

	static escapeRegex(str) {
		return str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
	}

	static base64(text, mode = 'encode') {
		if (mode === 'encode') return Buffer.from(text).toString('base64');
		if (mode === 'decode') return Buffer.from(text, 'base64').toString('utf8') || null;
		throw new TypeError(`${mode} base64 mode is not supported`);
	}

  	static fetchData(url = '') {
    		return fetch(url).then(res => res.json());
  	}
  	static txfetchData(url = ''){
    		return fetch(url).then(res=>res.text());
  	}
  	static async reactIfAble(msg, user, emoji, fallbackEmoji) {
		const dm = !msg.guild;
		if (fallbackEmoji && (!dm && !msg.channel.permissionsFor(user).has('USE_EXTERNAL_EMOJIS'))) {
			emoji = fallbackEmoji;
		}
		if (dm || msg.channel.permissionsFor(user).has(['ADD_REACTIONS', 'READ_MESSAGE_HISTORY'])) {
			try {
				await msg.react(emoji);
			} catch {
				return null;
			}
		}
		return null;
	}
}


module.exports = Util;
