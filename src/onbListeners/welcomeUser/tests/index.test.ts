const Discord = require('discord.js');
import { TextChannel, Client, Guild, GuildMember } from 'discord.js';
import { welcomeUser } from '../index';

describe('welcomeUser', () => {
  let client: Client;
  let channel: TextChannel;
  let guild: Guild;
  let member: GuildMember;

  beforeEach(() => {
    client = new Discord.Client();
    guild = new Discord.Guild(client, {});
    member = new Discord.GuildMember(client, {}, guild);
  });

  afterEach(() => {
    client.destroy();
  });

  it('should return nothing and not send a message if no channel is found', () => {
    channel = new Discord.TextChannel(guild, { type: 'text' });
    jest.spyOn(channel, 'send');
    welcomeUser(member);
    expect(channel.send).toHaveBeenCalledTimes(0);
  });

  // it('should send an embed if channel is found', () => {
  //   channel = new Discord.TextChannel(guild, { type: 'text', name: 'general' });
  //   jest.spyOn(channel, 'send');
  //   welcomeUser(member);
  //   expect(channel.send).toHaveBeenCalledTimes(1);
  // });
});
