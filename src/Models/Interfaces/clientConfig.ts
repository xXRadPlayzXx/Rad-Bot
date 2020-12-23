import { Snowflake } from "discord.js";
export interface clientConfig {
  owners?: Array<Snowflake> | Snowflake;
  token: string;
  defualtPrefix: string;
  commandsDir: string;
  eventsDir: string;
}
