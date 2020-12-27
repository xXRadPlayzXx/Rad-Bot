import RadClient from "./Structures/RadClient";
import consola from "consola";

import { config } from "dotenv";
import { Mongoose } from "mongoose";

config();

const client = new RadClient();
client.start({
  commandsDir: "Commands",
  token: process.env.BOT_TOKEN,
  eventsDir: "Events",
  owners: ["779358708672102470"],
  defualtPrefix: "r!",
  deleteCmdOnTrigger: true,
});
