const Discord = require('discord.js');
import { DMChannel, MessageEmbed, NewsChannel, TextChannel } from 'discord.js';
import { ErrorType } from '../types';

export const sendError = async (
  type: ErrorType,
  channel: TextChannel | DMChannel | NewsChannel,
  params?: {
    incorrectArg?: string;
  }
) => {
  let errorMessage: string;
  let errorTitle: string;

  switch (type) {
    case ErrorType.extApi:
      errorTitle = 'External API Error';
      errorMessage =
        'Something went wrong on our API call to an external service.';
      break;
    case ErrorType.badArg:
      errorTitle = 'Bad Argument';
      errorMessage = `That argument type (${params.incorrectArg}) is not supported`;
      break;
    case ErrorType.discordApi:
      errorTitle = 'Discord API failure';
      errorMessage = `Something went wrong communicating with Discord. It's a miracle you even got this message, to be honest.`;
      break;
  }

  const embed: MessageEmbed = new Discord.MessageEmbed();

  embed.setColor('#3e7493').setTitle(errorTitle).setDescription(errorMessage);

  try {
    await channel.send(embed);
    return true;
  } catch (err) {
    console.error('Could not send error message to Discord');
    console.error(errorTitle);
    console.error(errorMessage);
    console.error(err);
    return false;
  }
};
