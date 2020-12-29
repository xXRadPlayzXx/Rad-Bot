import { Message } from "discord.js";
import RadClient from "../Structures/RadClient";
import ms from "ms";
export = {
  name: "ping",
  aliases: ["latency", "uptime", "botuptime", "raduptime"],
  description: "Ping => Pong",
  category: "Info",
  reqPerms: [],
  maxArgs: 0,
  cooldown: "1m",
  callback: async (message: Message, args: string[], bot: RadClient) => {
    const msg = await message.reply(
      bot.embed(
        {
          title: "Pinging...",
        },
        message,
        false
      )
    );
    setTimeout(() => {
      msg.edit(
        bot.embed(
          {
            title: "Pong!",
            fields: [
              {
                name: "Ping (Message Edit):",
                value: `\`\`${
                  msg.createdTimestamp - message.createdTimestamp
                }\`\`ms`,
                inline: true,
              },
              {
                name: "WebSocket:",
                value: `\`\`${bot.ws.ping}\`\`ms`,
                inline: true,
              },
              {
                name: "UPTime:",
                value: `\`\`${ms(bot.uptime, { long: false })}\`\``,
                inline: true,
              },
            ],
          },
          message,
          false
        )
      );
    }, 750);
  },
};
