import RadClient from "./Structures/RadClient";
import { config } from "dotenv";
config();
const client = new RadClient();
client.start({
  commandsDir: "Commands",
  token: "Nzc5NDE3Njc3NTc1ODgwNzg0.X7gPRw.-KYcy1i1TJ4vCMs4u762ijuzjZ4",
  defualtPrefix: "!",
  eventsDir: "Events",
});
