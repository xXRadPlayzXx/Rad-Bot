import RadClient from "../Structures/RadClient";
import chalk from "chalk"
import consola from "consola"
import { Command } from "../Models/Interfaces/command"
import { Message, MessageEmbed } from "discord.js";
export = {
    name: 'message',
    run: async(self: RadClient, message: Message) => {
        const mentionRegex = RegExp(`^<@!?${self.user.id}>$`);
        const mentionRegexPrefix = RegExp(`^<@!?${self.user.id}>`);

        if (message.author.bot) return;

        if (!message.guild) {
          message.react("❌");
          return message.channel.send(
            self.embed(
              {
                title: `Error Occured | ${self.user.username}`,
                description: `Commands can only be executed in a server.`,
              },
              message
            )
          );
          return;
        }

        if (message.content.match(mentionRegex))
          return message.channel.send(
            self.embed(
              {
                title: `Prefix | ${self.user.username}`,
                description: `My prefix for **${message.guild.name}** Is **\`\`${self.config.defualtPrefix}\`\`**`,
              },
              message
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
          return message
            .reply(
              self.embed(
                {
                  title: `Error Occured | ${self.user.username}`,
                  description: `I cannot find the command **\`\`${cmd}\`\`**`,
                },
                message
              )
            )
            .then((m) => m.delete({ timeout: 5000 }));
        }

        const isOwner = await self.isOwner(self.config.owners, message);
        if (isOwner === false && command.ownerOnly === true) {
          return message.reply(
            self.embed(
              {
                title: `Error Occured | ${self.user.username}`,
                description: `Only a bot owner can run this command.`,
              },
              message
            )
          );
        }
        if (
          command.guildOwnerOnly === true &&
          message.member.id !==
            message.guild.members.cache.get(message.guild.ownerID).id
        ) {
          return message.reply(
            self.embed(
              {
                title: `Error Occured | ${self.user.username}`,
                description: `Only **${message.guild.name}**_'s owner_ can run this command.`,
              },
              message
            )
          );
        }
        await command._callback(message, args, self).catch((err: Error) => {
          const embed: MessageEmbed = self.embed(
            {
              title: `Error Occured | ${self.user.username}`,
              description: `_\`\`${err.message}\`\`_`,
            },
            message
          );
          message.reply(embed).then((m) => m.delete({ timeout: 5000 }));
          consola.error(`${err.name} | ${err.message}`);
        });
    }    
}