import RadClient from "./Structures/RadClient";
import { config } from "dotenv";
config();
const client = new RadClient();
client.start({
  commandsDir: "Commands",
  token: "Nzc5NDE3Njc3NTc1ODgwNzg0.X7gPRw.p_9AojeKZVgaYTF59pD6nao_EKo",
  defualtPrefix: "!",
  eventsDir: "Events",
});
