import {
  Client,
  Message,
  Snowflake,
  MessageEmbedOptions,
  MessageEmbed,
  ClientOptions,
  Collection,
  ColorResolvable,
  GuildMember,
  PermissionResolvable,
  PermissionString,
} from "discord.js";

import path from "path";
import Discord from "discord.js";
import consola from "consola";
import chalk from "chalk";

import { clientConfig } from "../Models/Interfaces/clientConfig";
import { Command } from "../Models/Interfaces/command";
import { Event } from "../Models/Interfaces/event";
import { version } from "../../package.json";
import { readdirSync } from "fs";
import { stringify } from "querystring";

var self: RadClient;

class RadClient extends Client {
  public embedColor: ColorResolvable;
  public commands: Collection<string, Command> = new Collection();
  public aliases: Collection<string, string> = new Collection();
  public events: Collection<string, Event> = new Collection();
  public owners: string[];
  public config: clientConfig;
  public deleteCmdMessageOnTrigger: boolean;

  public constructor(options?: ClientOptions) {
    super(options);
    self = this;
  }
  public colorText(
    text: string,
    subTitles?: string[] | string,
    title: string = "Rad Bot"
  ) {
    var baseTitle = `${title} ${chalk.cyan("|")} `;
    if (typeof subTitles === "string") {
      subTitles = [subTitles];
    }
    if (subTitles) {
      subTitles.forEach((subtitle: string, index: number) => {
        baseTitle += `${chalk.blue(subtitle)} ${chalk.cyan("|")} `;
      });
    }

    return `${baseTitle}${text}`;
  }
  public async isOwner(ids: string[], message: Message): Promise<boolean> {
    let toReturn: boolean;
    ids.forEach((id: string, index: number) => {
      id = ids[index];
      if (message.member.id !== id) {
        toReturn = false;
      } else {
        toReturn = true;
      }
    });
    return toReturn;
  }
  public async start(config: clientConfig): Promise<void> {
    this.config = config;
    this.login(config.token);
    const commandFiles = readdirSync(
      path.join(__dirname, "..", config.commandsDir)
    ).filter((f) => f.endsWith(".ts"));
    commandFiles.forEach(async (commandFile: any) => {
      const fileName = commandFile.split(".")[0];
      commandFile = await import(
        path.join(__dirname, "..", config.commandsDir, fileName)
      );
      commandFile = commandFile.default;
      const missing: string[] = [];
      let callbackCounter: number = 0;
      if (commandFile.run) {
        callbackCounter++;
        commandFile._callback = commandFile.run;
      }
      if (commandFile.callback) {
        callbackCounter++;
        commandFile._callback = commandFile.callback;
      }
      if (commandFile.execute) {
        callbackCounter++;
        commandFile._callback = commandFile.execute;
      }
      if (callbackCounter > 1) {
        return consola.warn(
          `Command Handler > Commands (${fileName}) can have run functions, But not multiple.`
        );
      }
      if (!commandFile.name) missing.push("Name");
      if (!commandFile.category) missing.push("Category");
      if (!commandFile.description) missing.push("Description");
      if (missing.length) {
        return consola.warn(
          `Command Handler > Command ${fileName} is missing the proprties: ${missing.join(
            ", "
          )}`
        );
      }
      self.aliases.set(fileName, commandFile.name);
      this.commands.set(commandFile.name, commandFile);
      if (typeof commandFile.aliases === "string")
        commandFile.aliases = [commandFile.aliases];
      if (commandFile.aliases) {
        commandFile.aliases.forEach((alias: string) => {
          self.aliases.set(alias, commandFile.name);
        });
      }
    });

    const eventFiles = readdirSync(
      path.join(__dirname, "..", config.eventsDir)
    ).filter((f) => f.endsWith(".ts"));
    eventFiles.forEach(async (fileName: string, index: number) => {
      fileName = fileName.split(".")[0];
      let eventFile: Event = await import(`../${config.eventsDir}/${fileName}`);
      this.on(eventFile.name, eventFile.run.bind(null, self));
      this.events.set(eventFile.name, eventFile);
    });
  }

  public getColor(message: Message): ColorResolvable {
    const color =
      message.guild.me.displayHexColor === "#000000"
        ? "#ff5600"
        : message.guild.me.displayHexColor;
    return color;
  }

  public embed(options: MessageEmbedOptions, message: Message): MessageEmbed {
    return new MessageEmbed(options)
      .setColor(this.getColor(message))
      .setAuthor(
        message.member.displayName || message.author.username,
        message.author.displayAvatarURL({ dynamic: true, format: "png" })
      )
      .setFooter(
        `${this.user.username} | ${version}`,
        this.user.displayAvatarURL({ dynamic: true, format: "png" })
      );
  }
}
export = RadClient;
