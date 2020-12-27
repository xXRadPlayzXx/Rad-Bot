import {
  GuildChannel,
  GuildChannelManager,
  Message,
  TextChannel,
} from "discord.js";
import RadClient from "../Structures/RadClient";

export = {
  name: "purge",
  aliases: ["clearmessages", "deletemessages"],
  description: "Clears the channel.",
  category: "Moderation",
  reqPerms: ["MANAGE_MESSAGES"],
  syntax: "<?channel> <amount / type>",
  run: async (message: Message, args: string[], bot: RadClient) => {
    const guildChannels = await message.guild.channels.cache.filter(
      (ch) => ch.type === "text"
    );
    var inserted: any = args[1];
    var msgs = await message.channel.messages.fetch();
    if ((inserted = "bots"))
      msgs = msgs.filter((message) => message.author.bot);
    var channel: any =
      message.mentions.channels.first() ||
      guildChannels.find((ch) => ch.name.toLowerCase() === args[0]) ||
      guildChannels.get(args[0]);
    if (!channel) {
      channel = message.channel;
      if (typeof inserted === "number") {
        inserted = args[0];
      }
    }
    if (inserted > 100)
      return message.channel.send(
        bot.embed(
          {
            title: `Error Occured | ${bot.user.username}`,
            description: `I cannot delete an amount higher than 100.`,
          },
          message,
          false
        )
      );
    channel.bulkDelete(msgs, true);
  },
};
