const Discord = require('discord.js');
import { handleMessage } from '../index';
import { TextChannel, Client, Guild, GuildMember, Message } from 'discord.js';
import { handleRecommendCommand, handleHelpCommand } from '../commands';
const { bcbPrefix } = require('../../../../config/discord.json');
jest.mock('../commands');

describe('handleMessage', () => {
  let client: Client;
  let channel: TextChannel;
  let guild: Guild;
  let member: GuildMember;

  beforeEach(() => {
    client = new Discord.Client();
    guild = new Discord.Guild(client, {});
    member = new Discord.GuildMember(client, {}, guild);
    channel = new Discord.TextChannel(guild, { type: 'text' });
    jest.clearAllMocks();
  });

  afterEach(() => {
    client.destroy();
  });

  it('should return nothing if a message does not begin with the right prefix', () => {
    const message: Message = new Discord.Message(
      client,
      { id: '1', content: '!banana recommend random' },
      channel
    );

    handleMessage(message);

    expect(handleRecommendCommand).toHaveBeenCalledTimes(0);
    expect(handleHelpCommand).toHaveBeenCalledTimes(0);
  });

  it('should return nothing if a message comes from a bot', () => {
    const message: Message = new Discord.Message(
      client,
      { id: '1', content: '!bc recommend random', author: { bot: true } },
      channel
    );

    handleMessage(message);

    expect(handleRecommendCommand).toHaveBeenCalledTimes(0);
    expect(handleHelpCommand).toHaveBeenCalledTimes(0);
  });

  it('should called recommend handler if recommend command given', () => {
    const arg = 'random';
    const message: Message = new Discord.Message(
      client,
      { id: '1', content: `!bc recommend ${arg}`, author: { bot: false } },
      channel
    );

    handleMessage(message);

    expect(handleRecommendCommand).toHaveBeenCalledTimes(1);
    expect(handleRecommendCommand).toHaveBeenCalledWith(arg, channel);
    expect(handleHelpCommand).toHaveBeenCalledTimes(0);
  });

  it('should called help handler if help command given', () => {
    const message: Message = new Discord.Message(
      client,
      { id: '1', content: '!bc help', author: { bot: false } },
      channel
    );

    handleMessage(message);

    expect(handleRecommendCommand).toHaveBeenCalledTimes(0);
    expect(handleHelpCommand).toHaveBeenCalledTimes(1);
    expect(handleHelpCommand).toHaveBeenCalledWith(message);
  });

  it('should not call anything if the command is wrong', () => {
    const message: Message = new Discord.Message(
      client,
      { id: '1', content: '!bc banana', author: { bot: false } },
      channel
    );

    handleMessage(message);

    expect(handleRecommendCommand).toHaveBeenCalledTimes(0);
    expect(handleHelpCommand).toHaveBeenCalledTimes(0);
  });
});
