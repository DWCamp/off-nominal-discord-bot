const Discord = require('discord.js');
import { DMChannel, MessageEmbed, NewsChannel, TextChannel } from 'discord.js';
import { ErrorType } from '../../types';

export const handleHelpCommand = async (
  channel: TextChannel | DMChannel | NewsChannel
) => {
  const embed: MessageEmbed = new Discord.MessageEmbed();

  embed
    .setColor('#3e7493')
    .setTitle('Book Club Bot Help')
    .setDescription(
      'Book Club Bot can serve you recommendations using the "recommend" command.'
    )
    .addFields(
      {
        name: '!bc recommend random',
        value: 'Gives you a random book from our collection.',
      },
      {
        name: '!bc recommend best',
        value:
          'Gives you the book with the highest user rating in the last 60 days.',
      },
      {
        name: '!bc recommend favourite',
        value: `Gives you the book with the most community favourites in the last 60 days. And yes, that's favourite with a "u". :flag_ca:`,
      }
    );

  try {
    await channel.send(embed);
    return true;
  } catch (err) {
    throw ErrorType.discordApi;
  }
};
