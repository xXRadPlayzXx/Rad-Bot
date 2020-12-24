import RadClient from "../Structures/RadClient";
import consola from "consola";
import chalk from "chalk";
export = {
  name: "ready",
  run: (bot: RadClient) => {
    consola.success(bot.colorText(`Successfully logged in as ${bot.user.tag}`));

    consola.info(
      bot.colorText(
        `Successfully loaded ${chalk.cyanBright(bot.commands.size)} command${
          bot.commands.size === 1 ? "" : "s"
        }`,
        "Command Handler"
      )
    );
    consola.info(
      bot.colorText(
        `Successfully loaded ${chalk.cyanBright(bot.events.size)} event${
          bot.events.size === 1 ? "" : "s"
        }`,
        "Event Handler"
      )
    );
  },
};
