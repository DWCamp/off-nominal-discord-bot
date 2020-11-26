require('dotenv').config();
import { DMChannel, NewsChannel, TextChannel } from 'discord.js';
import { sendError } from '../../../../helpers/sendError';
import { ErrorType } from '../../../../types/index';
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
    try {
      const response = await axios.get(
        `${BASEURL}/api/recommendations?type=${type}`
      );
      await channel.send(response.data[0].slug);
    } catch (err) {
      console.error(err);
      sendError(ErrorType.api, channel);
    }
  };

  switch (arg) {
    case 'random':
      handleCommand(RecommendCommand.random);
      break;
    case 'best':
      axios;
      handleCommand(RecommendCommand.highestrated);
      break;
    case 'favourite':
      handleCommand(RecommendCommand.favourite);
      break;
    default:
      sendError(ErrorType.badCommand, channel, { incorrectArg: arg });
  }
};
