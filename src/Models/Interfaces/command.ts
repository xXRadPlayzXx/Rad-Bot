import { cmdRunFn } from "../cmdRunFn";

type category = "Moderation" | "Dev" | "Economy" | "Fun";

export interface Command {
  name: string;
  category: category;
  aliases?: string[] | string
}
