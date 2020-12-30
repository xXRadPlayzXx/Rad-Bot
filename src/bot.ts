// Imports \\
import readDir from "./Functions/readDir";
import clientConfig from "./Models/Interfaces/clientConfig";
import RadClient from "./Structures/RadClient";
import { config } from "dotenv"
// Variables
config()
const _clientConfig: clientConfig = {
  defualtPrefix: "r!",
  token: process.env.BOT_TOKEN,
  commandsDir: "Commands",
  eventsDir: "Events",
  deleteCmdOnTrigger: true,
  owners: ["779358708672102470"],
};
const client = new RadClient({
  messageCacheMaxSize: 180,
  messageEditHistoryMaxSize: 200,
  disableMentions: "everyone",
  messageSweepInterval: 180,
  messageCacheLifetime: 200,
});
// An async function
(async () => {
  await client.start(_clientConfig);
  const option = await readDir("Utils", "Logger.ts")
  console.log(option)
})()
