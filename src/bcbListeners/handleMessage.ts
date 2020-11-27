import { Message } from 'discord.js';
const { bcbPrefix } = require('../../config/discord.json');
import { parseMessage } from '../helpers';
import { handleRecommendCommand } from './commands/recommend';
import { handleHelpCommand } from './commands/help';
import { sendError } from '../helpers/sendError';
import { ErrorType } from '../types';

export const handleMessage = async (message: Message) => {
  const { channel, content, author } = message;

  if (!content.startsWith(bcbPrefix) || author.bot) return;

  const { args, command } = parseMessage(bcbPrefix, message);

  try {
    if (command === `recommend`) {
      await handleRecommendCommand(args[0], channel);
    } else if (command === 'help') {
      await handleHelpCommand(channel);
    }
  } catch (err) {
    if (err === ErrorType.badArg) {
      await sendError(err, channel, { incorrectArg: args[0] });
    } else {
      await sendError(err, channel);
    }
  }
};
