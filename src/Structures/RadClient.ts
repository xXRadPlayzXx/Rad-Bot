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
  TextChannel,
  GuildChannel,
  Guild,
  Role,
} from "discord.js";

import path from "path";
import consola from "consola";
import chalk from "chalk";
import ms from "ms";
import Logger from "../Models/Interfaces/logger";
import clientLogger from "../Utils/Logger";

import { clientConfig } from "../Models/Interfaces/clientConfig";
import { Command } from "../Models/Interfaces/command";
import { Event } from "../Models/Interfaces/event";
import { version } from "../../package.json";
import { readdirSync } from "fs";

var self: RadClient;

class RadClient extends Client {
  private _commands: Collection<string, Command> = new Collection();
  private _aliases: Collection<string, string> = new Collection();
  private _events: Collection<string, Event> = new Collection();
  private _owners: string[];
  private _cooldowns: Collection<string, string> = new Collection();
  private _config: clientConfig;
  private _logger: Logger = new clientLogger();

  public get commands(): Collection<string, Command> {
    return this._commands;
  }
  public get cooldowns(): Collection<string, string> {
    return this._cooldowns;
  }
  public get aliases(): Collection<string, string> {
    return this._aliases;
  }
  public get events(): Collection<string, Event> {
    return this._events;
  }
  public get owners(): string[] {
    return this._owners;
  }
  public get config(): clientConfig {
    return this._config;
  }
  public get logger(): Logger {
    return this._logger;
  }

  public constructor(options?: ClientOptions) {
    super(options);
    self = this;
  }
  /** From a normal white text to a colorful and style-ish text! */
  public colorText(
    text: string,
    subTitles?: string[] | string,
    title: string = chalk.magentaBright(`Rad Bot`)
  ) {
    if (title) title = chalk.magentaBright(title);
    var baseTitle = `${title} ${chalk.cyanBright("|")} `;
    if (typeof subTitles === "string") {
      subTitles = [subTitles];
    }
    if (subTitles) {
      subTitles.forEach((subtitle: string, index: number) => {
        baseTitle += `${chalk.blue(subtitle)} ${chalk.cyanBright("|")} `;
      });
    }

    return `${baseTitle}${text}`;
  }
  /** Mutes a member ! */
  public async moderationMute(
    member: GuildMember,
    message: Message,
    guild: Guild,
    reason: string = "The mute hammer has spoken!",
    time?: string | number
  ): Promise<void> {
    // If the time is in ms
    if (typeof time === "number") {
      time = ms(ms(time)); // the time will be in a string example: 6h2m3s5ms
    }
    let mutedRole: Role = (await guild.roles.fetch()).cache.find(
      (r) => r.name.toLowerCase() === "Muted".toLowerCase()
    );
    if (!mutedRole) {
      this.logger.warning(
        this.colorText("No Muted role found, creating a new one.", [
          "Moderation",
        ])
      );
      mutedRole = await guild.roles.create({
        data: {
          name: "Muted",
          color: `#000000`,
          permissions: [],
        },
        reason: `This server did not have a muted role so i made one!`,
      });
      guild.channels.cache.forEach(async (ch) => {
        await ch.createOverwrite(mutedRole, {
          SEND_MESSAGES: false,
          ADD_REACTIONS: false,
        });
      });
    }
    member.send(
      this.embed(
        {
          title: `The mute hammer has spoken!`,
          description: `You have been muted in **\`\`${message.guild.name}\`\`**`,
          fields: [
            {
              name: "Time:",
              value: time || "For ever",
              inline: false,
            },
            {
              name: "Reason:",
              value: reason,
              inline: false,
            },
          ],
        },
        message,
        false
      )
    );
    await member.roles.add(mutedRole);
    if (time) {
      setTimeout(async () => {
        await member.roles.remove(mutedRole);
      }, ms(time));
    }
  }
  /** Checks if a user is a bot owner */
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
  /** Starts the bot! */
  public async start(config: clientConfig): Promise<void> {
    this._config = config;
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
      this._aliases.set(fileName, commandFile.name);
      this._commands.set(commandFile.name, {
        cooldown: "3s",
        ...commandFile
      });
      if (typeof commandFile.aliases === "string")
        commandFile.aliases = [commandFile.aliases];
      if (commandFile.aliases) {
        commandFile.aliases.forEach((alias: string) => {
          self._aliases.set(alias, commandFile.name);
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
      this._events.set(eventFile.name, eventFile);
    });
  }

  public getColor(message: Message): ColorResolvable {
    const color =
      message.guild.me.displayHexColor === "#000000"
        ? "#FF5600"
        : message.guild.me.displayHexColor;
    return color;
  }
   /** Returns an embed! */
  public embed(
    options: MessageEmbedOptions,
    message: Message,
    error: boolean
  ): MessageEmbed {
    const embed: MessageEmbed = new MessageEmbed(options)
      .setColor(error ? 0xff0000 : 0xff5600)
      .setAuthor(
        message.member.displayName || message.author.username,
        message.author.displayAvatarURL({ dynamic: true, format: "png" })
      )
      .setFooter(
        `${this.user.username} | ${version}`,
        this.user.displayAvatarURL({ dynamic: true, format: "png" })
      );
    if (error) {
      embed.setThumbnail("https://i.imgur.com/IG8G9ZR.png");
    } else {
      embed.setThumbnail(
        this.user.displayAvatarURL({ dynamic: true, format: "png" })
      );
    }
    return embed;
  }
}
export = RadClient;
