import { eventRunFn } from "../Functions/eventRunFn";

export interface Event {
  name: string;
  run: eventRunFn;
}
