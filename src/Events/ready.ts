import { Mongoose } from "mongoose";

import connectToMongo from "../Models/Functions/connectToMongo";
import RadClient from "../Structures/RadClient";
import chalk from "chalk";
export = {
  name: "ready",
  run: async (bot: RadClient) => {
    var consola = bot.logger;
    let text = chalk.blue(`
    ██████╗░░█████╗░██████╗░  ██████╗░░█████╗░████████╗
    ██╔══██╗██╔══██╗██╔══██╗  ██╔══██╗██╔══██╗╚══██╔══╝
    ██████╔╝███████║██║░░██║  ██████╦╝██║░░██║░░░██║░░░
    ██`);

    text += chalk.magenta(`╔══██╗██╔══██║██║░░██║  ██╔══██╗██║░░██║░░░██║░░░
    ██║░░██║██║░░██║██████╔╝  ██████╦╝╚█████╔╝░░░██║░░░
    ╚═╝░░╚═╝╚═╝░░╚═╝╚═════╝░  ╚═════╝░░╚════╝░░░░╚═╝░░░`);
    console.log(`${text} \n`);

    consola.success(
      bot.colorText(`Logged in as ${chalk.greenBright(bot.user.tag)}`),
      new Date().getTime()
    );
    await connectToMongo();
    consola.success(
      bot.colorText("Connected to MongoDB", null, "Data Base"),
      new Date().getTime()
    );
    consola.info(
      bot.colorText(
        `Loaded ${chalk.cyanBright(bot.commands.size)} command${
          bot.commands.size === 1 ? "" : "s"
        }`,
        "Command Handler"
      )
    );
    consola.info(
      bot.colorText(
        `Loaded ${chalk.cyanBright(bot.events.size)} event${
          bot.events.size === 1 ? "" : "s"
        }`,
        "Event Handler"
      )
    );
  },
};
