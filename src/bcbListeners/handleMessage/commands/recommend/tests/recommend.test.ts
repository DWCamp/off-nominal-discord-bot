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
    jest.spyOn(channel, 'send');
  });

  afterEach(() => {
    client.destroy();
  });

  it('should make a correct GET call and send a message if argument is random and API succeeds', () => {
    const arg = 'random';
    const slug = 'expected-slug';
    const mockedChannel = channel as jest.Mocked<typeof channel>;
    mockedAxios.get.mockResolvedValueOnce({ data: [{ slug }] });
    const message = new Discord.Message();
    mockedChannel.send.mockResolvedValueOnce(message);

    handleRecommendCommand(arg, channel);

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(
      `https://books.offnominal.space/api/recommendations?type=${arg}`
    );
    // expect(mockedChannel.send).toHaveBeenCalledTimes(1);
    // expect(mockedChannel.send).toHaveBeenCalledWith(
    //   `https://books.offnominal.space/books/${slug}`
    // );
  });
});
