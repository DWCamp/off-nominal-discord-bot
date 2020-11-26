const Discord = require('discord.js');
import { Client, Guild, Message, TextChannel } from 'discord.js';
import { parseMessage } from '..';

describe('parseMessage', () => {
  let client: Client;
  let channel: TextChannel;
  let guild: Guild;

  beforeEach(() => {
    client = new Discord.Client();
    guild = new Discord.Guild(client);
    channel = new Discord.TextChannel(guild, { type: 'text' });
  });

  afterEach(() => {
    client.destroy();
  });

  it('should parse an empty message correctly', () => {
    const prefix = '!bc';
    const message: Message = new Discord.Message(
      client,
      { id: '1', content: '!bc' },
      channel
    );

    const { args, command } = parseMessage(prefix, message);

    expect(args).toEqual([]);
    expect(command).toEqual('');
  });

  it('should parse a correct command', () => {
    const prefix = '!bc';
    const message: Message = new Discord.Message(
      client,
      { id: '1', content: '!bc banana' },
      channel
    );

    const { args, command } = parseMessage(prefix, message);

    expect(args).toEqual([]);
    expect(command).toEqual('banana');
  });

  it('should parse a correct command and arguments', () => {
    const prefix = '!bc';
    const message: Message = new Discord.Message(
      client,
      { id: '1', content: '!bc banana big yellow curved' },
      channel
    );

    const { args, command } = parseMessage(prefix, message);

    expect(args).toEqual(['big', 'yellow', 'curved']);
    expect(command).toEqual('banana');
  });

  it('should parse correct command when space is missing', () => {
    const prefix = '!bc';
    const message: Message = new Discord.Message(
      client,
      { id: '1', content: '!bcbanana big yellow curved' },
      channel
    );

    const { args, command } = parseMessage(prefix, message);

    expect(args).toEqual(['big', 'yellow', 'curved']);
    expect(command).toEqual('banana');
  });

  it('should parse correct command when too many spaces', () => {
    const prefix = '!bc';
    const message: Message = new Discord.Message(
      client,
      { id: '1', content: '!bc    banana big yellow curved' },
      channel
    );

    const { args, command } = parseMessage(prefix, message);

    expect(args).toEqual(['big', 'yellow', 'curved']);
    expect(command).toEqual('banana');
  });

  it('should parse correct command despite casing', () => {
    const prefix = '!bc';
    const message: Message = new Discord.Message(
      client,
      { id: '1', content: '!bc BAnAna big yellow curved' },
      channel
    );

    const { args, command } = parseMessage(prefix, message);

    expect(args).toEqual(['big', 'yellow', 'curved']);
    expect(command).toEqual('banana');
  });
});
