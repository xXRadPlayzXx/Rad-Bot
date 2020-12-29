var toReturn: boolean;
import {
  BitFieldResolvable,
  Message,
  MessageEmbed,
  PermissionResolvable,
  PermissionString,
} from "discord.js";
import consola from "consola";
import RadClient from "../Structures/RadClient";
const validatePermissions = async (
  permissions: Array<PermissionResolvable>
): Promise<void> => {
  const validPermissions = [
    "CREATE_INSTANT_INVITE",
    "KICK_MEMBERS",
    "BAN_MEMBERS",
    "ADMINISTRATOR",
    "MANAGE_CHANNELS",
    "MANAGE_GUILD",
    "ADD_REACTIONS",
    "VIEW_AUDIT_LOG",
    "PRIORITY_SPEAKER",
    "STREAM",
    "VIEW_CHANNEL",
    "SEND_MESSAGES",
    "SEND_TTS_MESSAGES",
    "MANAGE_MESSAGES",
    "EMBED_LINKS",
    "ATTACH_FILES",
    "READ_MESSAGE_HISTORY",
    "MENTION_EVERYONE",
    "USE_EXTERNAL_EMOJIS",
    "VIEW_GUILD_INSIGHTS",
    "CONNECT",
    "SPEAK",
    "MUTE_MEMBERS",
    "DEAFEN_MEMBERS",
    "MOVE_MEMBERS",
    "USE_VAD",
    "CHANGE_NICKNAME",
    "MANAGE_NICKNAMES",
    "MANAGE_ROLES",
    "MANAGE_WEBHOOKS",
    "MANAGE_EMOJIS",
  ];
  validPermissions.forEach((perm: string, index: number) => {
    if (!validPermissions.includes(perm)) {
      return consola.error(`Unkown permission node: "${perm}"`);
    }
  });
};
const havePerms = async (
  permissions: Array<BitFieldResolvable<PermissionString>>,
  message: Message,
  self: RadClient
) => {
  await validatePermissions(permissions);
  permissions.forEach((perm: BitFieldResolvable<PermissionString>) => {
    if (
      !message.member.permissions.has(perm) ||
      !message.member.permissions.has(perm)
    ) {
      toReturn = false;
    } else {
      toReturn = true;
    }
  });
  return toReturn;
};
export = havePerms;
