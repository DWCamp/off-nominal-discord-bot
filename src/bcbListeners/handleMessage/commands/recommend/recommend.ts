import { Message } from 'discord.js';
import { sendError } from '../../../../helpers/sendError';
import { ErrorType } from '../../../../types';
const axios = require('axios');

const BASEURL = process.env.BASEURL;

enum RecommendCommand {
  random = 'random',
  highestrated = 'highestrate',
  favourite = 'favourite',
}

export const handleRecommendCommand = (arg: string, message: Message) => {
  const { channel } = message;

  const sendRecommendation = (slug) => {
    channel.send(`${BASEURL}/books/${slug}`);
  };

  const handleCommand = (type: RecommendCommand) => {
    axios
      .get(`${BASEURL}/api/recommendations?type=${type}`)
      .then((response) => sendRecommendation(response.data[0].slug))
      .catch((err) => {
        console.error(err);
        sendError(ErrorType.api, channel);
      });
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
