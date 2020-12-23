import RadClient from "./Structures/RadClient";
import { config } from "dotenv";
config();
const client = new RadClient();
client.start({
  commandsDir: "Commands",
  token: process.env.BOT_TOKEN,
  defualtPrefix: "!",
  eventsDir: "Events",
});
