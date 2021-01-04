const { Command } = require('discord-akairo');
const moment = require('moment');
require('moment-timezone');
const { MessageEmbed } = require('discord.js');
const filterLevels = {
  DISABLED: 'Off',
  MEMBERS_WITHOUT_ROLES: 'No Role',
  ALL_MEMBERS: 'Everyone'
};
const verificationLevels = {
  NONE: 'None',
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  VERY_HIGH: 'Highest'
};

module.exports = class ServerCommand extends Command {
  constructor(client) {
    super('server', {
      aliases: ['guildf', 'serverf', 'guild-fetch'],
      group: 'info',
      description: 'Responds with detailed information on the server.',
      ownerOnly: false,
    });
  }

  userPermissions(msg) {
    const operator = require("./operation")
    if (!operator.includes(msg.author.id)) {
      return 'operator';
    }
    return null;
  }
  async exec(msg) {
    if (!msg.guild.members.cache.has(msg.guild.ownerID)) await msg.guild.members.fetch(msg.guild.ownerID);
    const embed = new MessageEmbed()
      .setColor(0x00AE86)
      .setThumbnail(msg.guild.iconURL({ format: 'png' }))
      .addField('❯ Name', msg.guild.name, true)
      .addField('❯ ID', msg.guild.id, true)
      .addField('❯ Creation Date', moment(msg.guild.createdAt).tz("Asia/Tokyo").format('MM/DD/YYYY h:mm A'), true)
      .addField('❯ Owner', msg.guild.owner.user.tag, true)
      .addField('❯ Boost Count', msg.guild.premiumSubscriptionCount || 0, true)
      .addField('❯ Boost Tier', msg.guild.premiumTier ? `Tier ${msg.guild.premiumTier}` : 'None', true)
      .addField('❯ Region', msg.guild.region.toUpperCase(), true)
      .addField('❯ Explicit Filter', filterLevels[msg.guild.explicitContentFilter], true)
      .addField('❯ Verification Level', verificationLevels[msg.guild.verificationLevel], true)
      .addField('❯ Members', msg.guild.memberCount, true)
      .addField('❯ Roles', msg.guild.roles.cache.size, true)
      .addField('❯ Channels', msg.guild.channels.cache.filter(channel => channel.type !== 'category').size, true);
    return msg.channel.send(embed);
  }
};