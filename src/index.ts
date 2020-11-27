require('dotenv').config();
const Discord = require('discord.js');
import { Client, Message } from 'discord.js';
import { handleMessage as onbMessageHandler } from './onbListeners/handleMessage';
import { welcomeUser } from './onbListeners/welcomeUser';
import utilityListeners from './utilityListeners/';
import { handleMessage as bcbMessageHandler } from './bcbListeners/handleMessage';

/***********************************
 *  Off-Nominal Bot
 ************************************/

const offNomBot: Client = new Discord.Client();

offNomBot.once('ready', () => utilityListeners.logReady(offNomBot.user.tag));
offNomBot.on('message', (message: Message) =>
  onbMessageHandler(offNomBot, message)
);
offNomBot.on('guildMemberAdd', welcomeUser);

offNomBot.login(process.env.OFFNOM_BOT_TOKEN_ID);

/***********************************
 *  Book Club Bot
 ************************************/

const bookClubBot: Client = new Discord.Client();

bookClubBot.once('ready', () =>
  utilityListeners.logReady(bookClubBot.user.tag)
);
bookClubBot.on('message', bcbMessageHandler);

bookClubBot.login(process.env.BOOK_CLUB_BOT_TOKEN_ID);
