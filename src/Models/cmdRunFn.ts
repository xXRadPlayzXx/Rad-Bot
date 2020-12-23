import RadClient from "../Structures/RadClient";

export interface cmdRunFn {
  (bot: RadClient, ...args: any[]): Promise<void>;
}
