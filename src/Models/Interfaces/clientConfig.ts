import { Snowflake } from "discord.js";
export interface clientConfig {
  owners?: string[];
  token: string;
  commandsDir: string;
  eventsDir: string;
  defualtPrefix: string;
  deleteCmdOnTrigger: boolean;
}
