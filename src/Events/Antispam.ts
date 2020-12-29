import consolaGlobalInstance from "consola";
import { Guild, GuildMember, Message } from "discord.js";
import RadClient from "../Structures/RadClient";

const usersMap: Map<any, any> = new Map();

export = {
  name: "message",
  run: (client: RadClient, message: Message) => {
    if (message.author.bot) return;
    const LIMIT = 5;
    const DIFF = 2000;
    const TIMEOUT = 10000;
    const Mute = async (
      member: GuildMember,
      guild: Guild,
      message: Message
    ) => {
      const role = guild.roles.cache.find(
        (r) => r.name.toLowerCase() === "muted"
      );
      member.roles.add(role);
      message.channel.send(
        client.embed(
          {
            author: { name: "Action | Mute" },
            description: `${member.user.tag} Have been muted for **spamming**`,
            timestamp: new Date().getTime(),
            fields: [
              {
                name: "Time:",
                value: "6 Hours",
              },
            ],
          },
          message,
          false
        )
      );
      return;
    };
    if (usersMap.has(message.author.id)) {
      var usersData = usersMap.get(message.author.id);

      const { lastMessage, timer } = usersData;

      const difference =
        message.createdTimestamp - lastMessage.createdTimestamp;

      if (difference > DIFF) {
        clearTimeout(timer);
        usersData.lastMessage = message;
        usersData.msgCount = 1;
        usersData.timer = setTimeout(() => {
          usersMap.delete(message.author.id);
        }, TIMEOUT);
        usersMap.set(message.author.id, usersData);
      } else {
        var msgCount = usersData.msgCount;

        msgCount++;

        if (parseInt(msgCount) === LIMIT) {
          return Mute(message.member, message.guild, message);
        } else {
          usersData.msgCount = msgCount;
          usersMap.set(message.author.id, usersData);
        }
      }
    } else {
      const fn = setTimeout(() => {
        usersMap.delete(message.author.id);
        console.log("Removed from map.");
      }, TIMEOUT);

      usersMap.set(message.author.id, {
        msgCount: 1,
        lastMessage: message,
        timer: fn,
      });
    }
  },
};
