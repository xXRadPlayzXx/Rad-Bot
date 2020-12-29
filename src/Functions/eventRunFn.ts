import RadClient from "../Structures/RadClient";

export interface eventRunFn {
  (bot: RadClient, ...args: any[]): Promise<void>;
}
