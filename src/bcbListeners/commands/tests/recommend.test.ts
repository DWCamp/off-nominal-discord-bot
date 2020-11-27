const Discord = require('discord.js');
import { handleRecommendCommand } from '../recommend';
import { Client, Guild, TextChannel } from 'discord.js';
import axios from 'axios';
import { ErrorType } from '../../../types';
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

  it('should make a correct GET call and send a message if argument is random and API succeeds', async () => {
    const arg = 'random';
    const slug = 'expected-slug';

    mockedAxios.get.mockResolvedValueOnce({ data: [{ slug }] });

    const mockedSend = jest.spyOn(channel, 'send');
    const message = new Discord.Message();
    mockedSend.mockResolvedValueOnce(message);

    await handleRecommendCommand(arg, channel);

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(
      `https://books.offnominal.space/api/recommendations?type=${arg}`
    );
    expect(mockedSend).toHaveBeenCalledTimes(1);
    expect(mockedSend).toHaveBeenCalledWith(
      `https://books.offnominal.space/books/${slug}`
    );
  });

  it('should throw API error if API call fails', async () => {
    const arg = 'random';

    mockedAxios.get.mockRejectedValueOnce('blorp');

    expect(handleRecommendCommand(arg, channel)).rejects.toEqual(
      ErrorType.extApi
    );
  });

  it('should throw discord error if discord call fails', async () => {
    const arg = 'random';
    const slug = 'expected-slug';

    mockedAxios.get.mockResolvedValueOnce({ data: [{ slug }] });

    const mockedSend = jest.spyOn(channel, 'send');
    const message = new Discord.Message();
    mockedSend.mockRejectedValueOnce('blorp');

    expect(handleRecommendCommand(arg, channel)).rejects.toEqual(
      ErrorType.discordApi
    );
  });

  it('should throw badArg if arg is incorrect', async () => {
    const arg = 'bananas';

    expect(() => handleRecommendCommand(arg, channel)).toThrow(
      ErrorType.badArg
    );
  });
});
