import { DMChannel, NewsChannel, TextChannel } from 'discord.js';
import { ErrorType } from '../../types';

export const sendError = (
  type: ErrorType,
  channel: TextChannel | DMChannel | NewsChannel,
  options?: {
    incorrectArg?: string;
  }
) => {
  let errorMessage;
  switch (type) {
    case 'api':
      errorMessage = 'Oh no, something seems to have gone wrong.';
      break;
    case 'bad-command':
      errorMessage = `That recommend type (${options.incorrectArg}) is not supported`;
  }

  channel.send(errorMessage);
};
