import RadClient from "./Structures/RadClient";
import { config } from "dotenv";
config();
const client = new RadClient();
client.start({
  commandsDir: "Commands",
  token: "Nzc5NDE3Njc3NTc1ODgwNzg0.X7gPRw.JBKZiu5r9Qlwt1JKevGBtf5cV98",
  defualtPrefix: "!",
  eventsDir: "Events",
});
