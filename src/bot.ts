import RadClient from "./Structures/RadClient";
import { config } from "dotenv";
config();
const client = new RadClient();
client.start({
  commandsDir: "Commands",
  token: "Nzc5NDE3Njc3NTc1ODgwNzg0.X7gPRw.kOdlg6LMjpjjT1nETiMYH3RGjuc",
  defualtPrefix: "!",
  eventsDir: "Events",
});
