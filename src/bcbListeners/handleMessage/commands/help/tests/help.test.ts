const Discord = require('discord.js');
import { handleHelpCommand } from '../help';
import { Client, Guild, TextChannel } from 'discord.js';

describe('help', () => {
  let client: Client;
  let channel: TextChannel;
  let guild: Guild;

  beforeEach(() => {
    jest.clearAllMocks();
    client = new Discord.Client();
    guild = new Discord.Guild(client);
    channel = new Discord.TextChannel(guild, { type: 'text' });
  });

  afterEach(() => {
    client.destroy();
  });

  it('should send help embed', () => {
    const mockedSend = jest.spyOn(channel, 'send');
    const message = new Discord.Message();
    mockedSend.mockResolvedValueOnce(message);

    handleHelpCommand(channel);
    expect(mockedSend).toHaveBeenCalledTimes(1);
  });
});
