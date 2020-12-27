import { Channel, Message, MessageEmbed, TextChannel } from "discord.js";
import RadClient from "../Structures/RadClient";

export = {
  aliases: ["slowmode"],
  name: "slow",
  description: "Changes a channel slowmode",
  reqPerms: ["MANAGE_CHANNELS"],
  category: "Moderation",
  callback: async (message: Message, args: string[], bot: RadClient) => {
    try {
      const guild = bot.guilds.cache.get(message.guild.id);
      var channel: any =
        message.mentions.channels.first() ||
        guild.channels.cache.get(args[0]) ||
        guild.channels.cache.find((c) => c.name === args[0]);
      var duration = parseInt(args[1]);
      if (!channel) {
        channel = message.channel;
        duration = parseInt(args[0]);
      }

      const ResponseEmbed = new MessageEmbed()
        .setTitle("Slowmode Command")
        .setDescription("To Verify You Self Type yes in the chat")
        .setColor(bot.getColor(message))
        .setFooter("Created By • RadPlayz");
      const SMErrorEmbed2 = new MessageEmbed()
        .setTitle("Slowmode Command")
        .setDescription(`:x: | Cancled Changing <#${channel.id}> Slowmode `)
        .setColor(0xff0000)
        .setFooter("Oops Something went wrong:(");
      const SMErrorEmbed1 = new MessageEmbed()
        .setTitle("Slowmode Command")
        .setDescription("Please Use 26000 (6 Hours) Or Lower")
        .setColor(0xff0000)
        .setFooter("Created By • RadPlayz");

      message.channel
        .send(ResponseEmbed)
        .then((m) => m.delete({ timeout: 5000 }))
        .then(() => {
          return;
        });
      const response = await message.channel.awaitMessages(
        (m) => m.author.id === message.author.id,
        { max: 1 }
      );
      const { content } = response.first();
      if (duration > 26000) {
        message.channel.send(SMErrorEmbed1);
        return;
      }
      if (content.toLowerCase() === "yes") {
        const SlowModeEmbed = new MessageEmbed()
          .setTitle("Slowmode Command")
          .setDescription(
            `Successfully Changed <#${channel.id}> Slowmode To ${duration}`
          )
          .setColor(bot.getColor(message))
          .setFooter("Created By • RadPlayz");
        channel.setRateLimitPerUser(duration, args.join(" "));
        message.reply(SlowModeEmbed).then((m) => {
          m.react("✅");
          m.delete({ timeout: 15000 });
        });

        if (args[0] === "off" || args[1] === "off") {
          duration = 0;
        }
      }
      if (isNaN(duration)) {
        const SMErrorEmbed3 = new MessageEmbed()
          .setTitle("Slowmode Command")
          .setDescription('Please Provide A Number Either The Word "off"')
          .setColor(0xff0000)
          .setFooter("Created By • RadPlayz");
        message.delete();
        message.reply(SMErrorEmbed3);
        return;

        //['testing','hello','world']
        //.join(' ')
        //testing hello world
      }
    } catch (err) {
      console.log(err);
      message.reply("Error Occured");
    }
    return;
  },
};
