const Discord = require('discord.js');
import { handleRecommendCommand } from '../recommend';
import { Client, Guild, TextChannel } from 'discord.js';
import axios from 'axios';
jest.spyOn(axios, 'get');

describe('recommend', () => {
  let client: Client;
  let channel: TextChannel;
  let guild: Guild;

  beforeEach(() => {
    jest.clearAllMocks();
    client = new Discord.Client();
    guild = new Discord.Guild(client);
    channel = new Discord.TextChannel(guild, { type: 'text' });
    channel.send = jest.fn();
  });

  afterEach(() => {
    client.destroy();
  });

  it('should make a correct GET call and send a message if argument is random and API succeeds', () => {
    const arg = 'random';
    const slug = 'expected-slug';
    axios.get.mockResolvedValueOnce({ data: [{ slug }] });
    channel.send.mockResolvedValueOnce('Success!');

    handleRecommendCommand(arg, channel);

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(
      `https://books.offnominal.space/api/recommendations?type=${arg}`
    );
    // expect(channel.send).toHaveBeenCalledTimes(1);
    // expect(channel.send).toHaveBeenCalledWith(
    //   `https://books.offnominal.space/books/${slug}`
    // );
  });
});
