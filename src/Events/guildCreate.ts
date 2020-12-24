import RadClient from "../Structures/RadClient";
import consola from "consola";
import chalk from "chalk";
import { Guild } from "discord.js";

export = {
  name: "guildCreate",
  run: (self: RadClient, guild: Guild) => {
    consola.info(
      `${chalk.redBright(
        self.user.username
      )} Have been added to ${chalk.cyanBright(guild.name)}`
    );
  },
};
