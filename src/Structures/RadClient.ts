import {
  Client,
  Message,
  Snowflake,
  MessageEmbedOptions,
  MessageEmbed,
  ClientOptions,
  Collection,
  ColorResolvable,
} from "discord.js";
var self: RadClient;
import { clientConfig } from "../Models/Interfaces/clientConfig";
import { Command } from "../Models/Interfaces/command";
import { Event } from "../Models/Interfaces/event";
import { version } from "../../package.json";
import { readdirSync } from "fs";
import path from "path";
class RadClient extends Client {
  public embedColor: ColorResolvable;
  public commands: Collection<string, Command> = new Collection();
  public aliases: Collection<string, string> = new Collection();
  public events: Collection<string, Event> = new Collection();
  public owners: Array<Snowflake>;
  public config: clientConfig;

  public constructor(options?: ClientOptions) {
    super(options);
    self = this;
  }

  public async start(config: clientConfig): Promise<void> {
    this.config = config;
    this.login(config.token);
    const commandFiles = readdirSync(`../${config.commandsDir}/`).filter((f) =>
      f.endsWith(".ts")
    );
    commandFiles.forEach(async (commandFile: any) => {
      const fileName = commandFile.split(".")[0];
      commandFile = await import(`../${config.commandsDir}/${fileName}`);
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
        console.warn(
          `Command Handler > Commands (${fileName}) can have run functions, But not multiple.`
        );
      }
      if (!commandFile.name) missing.push("Name");
      if (!commandFile.category) missing.push("Category");
      if (!commandFile.description) missing.push("Description");
      if (missing.length) {
        return console.warn(
          `Command Handler > Command ${fileName} is missing the proprties: ${missing.join(
            ", "
          )}`
        );
      }
      this.commands.set(commandFile.name, commandFile);
      if (typeof commandFile.aliases === "string")
        commandFile.aliases = [commandFile.aliases];
      if (commandFile.aliases) {
        commandFile.aliases.forEach((alias: string) => {
          self.aliases.set(alias, commandFile.name);
        });
      }
      this.on("message", async function (message) {
        const mentionRegex = RegExp(`^<@!?${this.user.id}>$`);
        const mentionRegexPrefix = RegExp(`^<@!?${this.user.id}>`);

        if (message.author.bot) return;

        if (message.content.match(mentionRegex))
          return message.channel.send(
            self.embed(
              {
                title: `Prefix | ${self.user.username}`,
                description: `My prefix for **${message.guild.name}** Is **\`\`${config.defualtPrefix}\`\`**`,
              },
              message
            )
          );

        const prefix = message.content.toLowerCase().match(mentionRegexPrefix)
          ? message.content.match(mentionRegexPrefix)[0]
          : config.defualtPrefix;

        if (!message.content.toLowerCase().startsWith(prefix)) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/g);

        const cmd = args.shift().toLowerCase();

        const command: Command =
          self.commands.get(cmd) || self.commands.get(self.aliases.get(cmd));
        if (!command)
          return message.reply(
            self.embed(
              {
                description: `I cannot find the command **\`\`${cmd}\`\`**`,
              },
              message
            )
          );
        if (!message.guild) {
          message.react("❌");
          message.channel.send(
            self.embed(
              {
                description: `Commands can only be executed in a server.`,
              },
              message
            )
          );
          return;
        }
        if (command)
          await commandFile
            ._callback(message, args, self)
            .catch((err: Error) => {
              const embed: MessageEmbed = self.embed(
                {
                  title: `Error Occured | ${self.user.username}`,
                  description: `_\`\`${err.message}\`\`_`,
                },
                message
              );
              message.reply(embed);
            });
      });
    });

    this.on("ready", () => {
      console.log(
        `Command Handler > Loaded ${this.commands.size} Commands, ${this.aliases.size} Aliases.`
      );
    });
    const eventFiles = readdirSync(
      path.join(__dirname, "..", config.eventsDir)
    ).filter((f) => f.endsWith(".ts"));
    eventFiles.forEach(async (eventFile) => {});
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
