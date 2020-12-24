import { PermissionResolvable } from "discord.js";
import { cmdRunFn } from "../Functions/cmdRunFn";

type category = "Moderation" | "Dev" | "Economy" | "Fun";

export interface Command {
  name: string;
  category: category;
  aliases?: string[] | string;
  ownerOnly?: boolean;
  _callback: cmdRunFn;
  guildOwnerOnly?: boolean;
  reqPerms?: Array<PermissionResolvable>;
}
