import { eventRunFn } from "../eventRunFn";

export interface Event {
  name: string;
  run: eventRunFn;
}
