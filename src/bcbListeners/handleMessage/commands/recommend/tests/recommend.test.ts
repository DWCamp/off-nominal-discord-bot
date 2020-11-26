const Discord = require('discord.js');
import { handleRecommendCommand } from '../recommend';
import { Client, Guild, TextChannel } from 'discord.js';
import axios from 'axios';
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('recommend', () => {
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

  it('should make a correct GET call and send a message if argument is random and API succeeds', () => {
    const arg = 'random';
    const slug = 'expected-slug';

    mockedAxios.get.mockResolvedValueOnce({ data: [{ slug }] });

    const mockedSend = jest.spyOn(channel, 'send');
    const message = new Discord.Message();
    mockedSend.mockResolvedValueOnce(message);

    handleRecommendCommand(arg, channel);

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(
      `https://books.offnominal.space/api/recommendations?type=${arg}`
    );
    expect(mockedSend).toHaveBeenCalledTimes(1);
    expect(mockedSend).toHaveBeenCalledWith(
      `https://books.offnominal.space/books/${slug}`
    );
  });
});
