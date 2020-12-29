import {
  Channel,
  DMChannel,
  Guild,
  GuildChannel,
  GuildChannelManager,
  Message,
  NewsChannel,
  Snowflake,
  TextChannel,
  VoiceChannel,
} from "discord.js";
import { Collection } from "mongoose";
import RadClient from "../Structures/RadClient";

export = {
  name: "purge",
  aliases: ["clearmessages", "deletemessages"],
  description: "Clears the channel.",
  category: "Moderation",
  reqPerms: ["MANAGE_MESSAGES"],
  syntax: "<?channel> <type> <amount>",
  run: async (message: Message, args: string[], bot: RadClient) => {
    // var guild: Guild = message.guild;
    // const guildChannels = message.guild.channels.cache.filter(ch => ch.type === "text")
    // var channel: TextChannel | DMChannel | NewsChannel =
    //   // Method 1: search by the id
    //   guildChannels.get(args[0]) ||
    //   // Method 2: Search by the name
    //   guildChannels.find(
    //     (ch) => ch.name.toLowerCase() === args[0].toLowerCase()
    //   );
    // var type = args[1];
    // var amount = args[2];
    // if (!channel) {
    //   channel = message.channel
    // }
    // var toBulkDelete = guild.channels.cache.filter(ch => ch.type === "text").get(channel.id)
  },
};
