const Discord = require('discord.js');
import { handleMessage } from '../handleMessage';
import { TextChannel, Client, Guild, GuildMember, Message } from 'discord.js';
import { handleRecommendCommand } from '../commands/recommend';
import { handleHelpCommand } from '../commands/help';
import { ErrorType } from '../../types';
import { sendError } from '../../helpers/sendError';
const { bcbPrefix } = require('../../../config/discord.json');
jest.mock('../commands/help');
jest.mock('../commands/recommend');
jest.mock('../../helpers/sendError');

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

  it('should call recommend handler if recommend command given', () => {
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

  it('should call help handler if help command given', () => {
    const message: Message = new Discord.Message(
      client,
      { id: '1', content: '!bc help', author: { bot: false } },
      channel
    );

    handleMessage(message);

    expect(handleRecommendCommand).toHaveBeenCalledTimes(0);
    expect(handleHelpCommand).toHaveBeenCalledTimes(1);
    expect(handleHelpCommand).toHaveBeenCalledWith(channel);
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

  it('should call sendError if error api thrown', async () => {
    const message: Message = new Discord.Message(
      client,
      { id: '1', content: '!bc help', author: { bot: false } },
      channel
    );

    const error = ErrorType.discordApi;

    (handleHelpCommand as jest.Mock).mockRejectedValueOnce(error);

    await handleMessage(message);

    expect(handleRecommendCommand).toHaveBeenCalledTimes(0);
    expect(handleHelpCommand).toHaveBeenCalledTimes(1);
    expect(sendError).toHaveBeenCalledTimes(1);
    expect(sendError).toHaveBeenCalledWith(error, channel);
  });

  it('should call sendError if error bad arg thrown', async () => {
    const message: Message = new Discord.Message(
      client,
      { id: '1', content: '!bc recommend bananas', author: { bot: false } },
      channel
    );

    const error = ErrorType.badArg;

    (handleRecommendCommand as jest.Mock).mockRejectedValueOnce(error);

    await handleMessage(message);

    expect(handleRecommendCommand).toHaveBeenCalledTimes(1);
    expect(handleHelpCommand).toHaveBeenCalledTimes(0);
    expect(sendError).toHaveBeenCalledTimes(1);
    expect(sendError).toHaveBeenCalledWith(error, channel, {
      incorrectArg: 'bananas',
    });
  });
});
