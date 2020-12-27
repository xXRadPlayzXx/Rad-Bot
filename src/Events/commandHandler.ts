import RadClient from "../Structures/RadClient";
import { Command } from "../Models/Interfaces/command";
import { Message, MessageEmbed } from "discord.js";
import havePerms from "../Models/Functions/havePerms";
export = {
  name: "message",
  run: async (self: RadClient, message: Message) => {
    var consola = self.logger;

    if (message.author.bot) return;

    if (!message.guild) {
      message.react("❌");
      return message.channel.send(
        self.embed(
          {
            title: `Error Occured | ${self.user.username}`,
            description: `Commands can only be executed in a server.`,
          },
          message,
          true
        )
      );
      return;
    }
    const mentionRegex = RegExp(`^<@!?${self.user.id}>$`);
    const mentionRegexPrefix = RegExp(`^<@!?${self.user.id}>`);
    if (message.content.match(mentionRegex))
      return message.channel.send(
        self.embed(
          {
            title: `Prefix | ${self.user.username}`,
            description: `My prefix for **${message.guild.name}** Is **\`\`${self.config.defualtPrefix}\`\`**`,
          },
          message,
          false
        )
      );

    const prefix = message.content.toLowerCase().match(mentionRegexPrefix)
      ? message.content.match(mentionRegexPrefix)[0]
      : self.config.defualtPrefix;

    if (!message.content.toLowerCase().startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);

    const cmd = args.shift().toLowerCase();

    const command: Command =
      self.commands.get(cmd) || self.commands.get(self.aliases.get(cmd));
    if (!command) {
      message.delete();
      return message
        .reply(
          self.embed(
            {
              title: `Unkown command | ${self.user.username}`,
              description: `I cannot find the command **\`\`${cmd}\`\`**`,
            },
            message,
            true
          )
        )
        .then((m) => m.delete({ timeout: 5000 }));
    }

    const isOwner = await self.isOwner(self.config.owners, message);
    if (isOwner === false && command.ownerOnly === true) {
      message.channel.send(
        self.embed(
          {
            title: `Permission Error | ${self.user.username}`,
            description: `Only a bot owner can run this command.`,
          },
          message,
          true
        )
      );
      message.delete();
      return;
    }
    if (
      command.guildOwnerOnly === true &&
      message.member.id !==
        message.guild.members.cache.get(message.guild.ownerID).id
    ) {
      message.delete();
      return message.channel.send(
        self.embed(
          {
            title: `Permission Error | ${self.user.username}`,
            description: `Only **${message.guild.name}**_'s owner_ can run this command.`,
          },
          message,
          true
        )
      );
    }
    if (self.config.deleteCmdOnTrigger === true) {
      message.delete();
    }

    if (command.reqPerms.length) {
      const result = await havePerms(command.reqPerms, message, self);
      if (result === false) {
        const permErrEmbed: MessageEmbed = self.embed(
          {
            title: `Permission Error | ${self.user.username}`,
            description: `In order to use this command you must have the following permission${
              command.reqPerms.length === 1 ? "" : "s"
            }: \`\`${command.reqPerms.join(", ")}\`\``,
          },
          message,
          true
        );
        return message.channel
          .send(permErrEmbed)
          .then((m) => m.delete({ timeout: 5000 }));
      }
    }
    if (
      (command.minArgs && args.length < command.minArgs) ||
      (command.maxArgs !== null && args.length > command.maxArgs)
    ) {
      message.delete();
      message.channel.send(
        self.embed(
          {
            title: `Incorrect Usage! | ${self.user.username}`,
            description: `Please use the following syntax: ${
              self.config.defualtPrefix
            }${cmd} ${command.syntax || ""}`,
          },
          message,
          true
        )
      );
    }
    await command._callback(message, args, self).catch((err: Error) => {
      self.config.deleteCmdOnTrigger ? message.delete() : "";

      const unkownErrEmbed: MessageEmbed = self.embed(
        {
          title: `Error Occured | ${self.user.username}`,
          description: `Please report this error to the developers: _\`\`${err.message}\`\`_ `,
        },
        message,
        true
      );
      message.channel
        .send(unkownErrEmbed)
        .then((m) => m.delete({ timeout: 5000 }));
      consola.error(`${err.name} | ${err.message}`);
    });
  },
};
