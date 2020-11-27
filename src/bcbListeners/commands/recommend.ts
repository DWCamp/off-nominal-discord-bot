require('dotenv').config();
import { DMChannel, NewsChannel, TextChannel } from 'discord.js';
import { ErrorType } from '../../types';
const axios = require('axios');

const BASEURL = process.env.BASEURL;

enum RecommendCommand {
  random = 'random',
  highestrated = 'highestrate',
  favourite = 'favourite',
}

export const handleRecommendCommand = (
  arg: string,
  channel: TextChannel | DMChannel | NewsChannel
) => {
  const handleCommand = async (type: RecommendCommand) => {
    let response;

    try {
      response = await axios.get(`${BASEURL}/api/recommendations?type=${type}`);
    } catch (err) {
      throw ErrorType.extApi;
    }

    try {
      await channel.send(`${BASEURL}/books/${response.data[0].slug}`);
      return true;
    } catch (err) {
      throw ErrorType.discordApi;
    }
  };

  switch (arg) {
    case 'random':
      return handleCommand(RecommendCommand.random);
    case 'best':
      return handleCommand(RecommendCommand.highestrated);
    case 'favourite':
      return handleCommand(RecommendCommand.favourite);
    default:
      throw ErrorType.badArg;
  }
};
