import { Ref } from "react";

declare module "@uidotdev/usehooks" {
  export function useClickAway(cb: Function): Ref;
}
