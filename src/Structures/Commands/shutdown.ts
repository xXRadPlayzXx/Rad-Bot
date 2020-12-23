import { Presence } from "discord.js";
import RadClient from "../RadClient";

export = {
  name: "shutdown",
  category: "Dev",
  ownerOnly: true,
  description: "Shuts down the bot!",
  callback: (message, args, bot: RadClient) => {
    bot.user
      .setPresence({
        status: "invisible",
      })
      .then((presence: Presence) => {
          process.exit()
      });
  },
};
