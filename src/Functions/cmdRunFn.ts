import { Message, StringResolvable } from "discord.js";
import RadClient from "../Structures/RadClient";

export interface cmdRunFn {
  (message: Message, args: string[], bot: RadClient): Promise<void>;
}
