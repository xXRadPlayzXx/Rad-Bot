import { Message, MessageEmbed, MessageReaction, Role, User } from "discord.js";
import RadClient from "../Structures/RadClient";

export = {
  name: "mute",
  aliases: ["m"],
  reqPerms: ["MANAGE_MESSAGES"],
  description: "Mutes members",
  category: "Moderation",
  syntax: "<member> <reason?>",
  run: async (message: Message, args: string[], bot: RadClient) => {
    const guildMembers = await message.guild.members.fetch();
    // The target
    const target =
      message.mentions.members.first() ||
      guildMembers.find(
        (m) => m.user.username.toLowerCase() === args[0].toLowerCase()
      ) ||
      guildMembers.find(
        (m) => m.displayName.toLowerCase() === args[0].toLowerCase()
      ) ||
      guildMembers.get(args[0]) ||
      message.guild.member(message.mentions.users.first());
    if (target.id === message.guild.me.id) {
      message.channel.send(
        bot.embed(
          {
            title: `why, just why? what is wrong with me?`,
            description: `**You know that i have feelings too? :sob:**`,
          },
          message,
          true
        )
      );
      return;
    }
    if (target.user.bot) {
      message.channel.send(
        bot.embed(
          {
            title: `Like seriously, Why r u muting a bot?`,
            description: `Why r u muting a bot?`,
          },
          message,
          true
        )
      );
      return;
    }
    if (!target)
      return message.channel.send(
        bot.embed(
          {
            title: `Error Occured | ${bot.user.username}`,
            description: `Please specify a valid member to mute.`,
          },
          message,
          false
        )
      );
    // The muted role
    let mutedRole: Role = message.guild.roles.cache.find(
      (r) => r.name.toLowerCase() === "muted".toLowerCase()
    );
    let reason: string = args.slice(1).join(" ");
    if (!reason) reason = `The mute hammer has spoken`;
    if (!mutedRole) {
      const noRoleEmbed: MessageEmbed = bot.embed(
        {
          title: `Error Occured | ${bot.user.username}`,
          description: `It appears that this server currently does not have a \`\`Muted\`\`, Would you like to generate one?`,
        },
        message,
        false
      );

      const msg: Message = await message.channel.send(noRoleEmbed);
      msg.react("✅");
      msg.react("❌");
      const filter = (reaction: MessageReaction, user: User) =>
        ["✅", "❌"].includes(reaction.emoji.name) &&
        user.id === message.author.id;
      const collector = msg.createReactionCollector(filter);
      collector.on("collect", async (reaction) => {
        switch (reaction.emoji.name) {
          case "✅":
            if (message.guild.roles.cache.size >= 250) {
              const maxRolesEmbed: MessageEmbed = bot.embed(
                {
                  title: `Error Occured | ${bot.user.username}`,
                  description:
                    "Failed to generate a ``Muted`` role. You server have too many roles [250]\nMore information can be found at: https://discordia.me/en/server-limits')",
                },
                message,
                false
              );
              message.channel.send(maxRolesEmbed).then((message) => {
                message.delete({ timeout: 7500 });
              });
              collector.stop();
              break;
            }
            msg.reactions.removeAll();
            if (
              !message.guild.me.hasPermission([
                "MANAGE_CHANNELS",
                "MANAGE_ROLES",
              ])
            ) {
              const noPermsEmbed: MessageEmbed = bot.embed(
                {
                  title: `Error Occured | ${bot.user.username}`,
                  description:
                    "In order to create a ``Muted`` role, i must have the following permissions: ``MANAGE_CHANNELS, MANAGE_ROLES``",
                },
                message,
                true
              );
              message.channel
                .send(noPermsEmbed)
                .then((m) => m.delete({ timeout: 7500 }));
              collector.stop();
              break;
            }
            mutedRole = await message.guild.roles.create({
              data: {
                name: "Muted",
                color: "#000000",
              },
              reason: "They ordered one, so i made it",
            });
            message.guild.channels.cache.forEach(async (channel) => {
              await channel.createOverwrite(mutedRole, {
                SEND_MESSAGES: false,
                ADD_REACTIONS: false,
              });
            });
          case "❌":
            const cancelEmbed: MessageEmbed = bot.embed(
              {
                title: `Cancelled!`,
                description: `Successfully cancelled the muting process.`,
              },
              message,
              true
            );
            message.channel
              .send(cancelEmbed)
              .then((m) => m.delete({ timeout: 7500 }));
            collector.stop();
            break;
        }
      });
    }
    await target.roles.add(mutedRole);
    message.channel.send(
      bot.embed(
        {
          title: `Mute Command | ${bot.user.username}`,
          description: `Successfully muted <@${target.id}> for **"**${reason}**"**.`,
        },
        message,
        false
      )
    );
  },
};
