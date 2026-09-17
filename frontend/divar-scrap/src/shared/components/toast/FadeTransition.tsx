import { cssTransition } from "react-toastify";

export const FadeTransition = cssTransition({
  enter: "rt-fadeonly-enter",
  exit: "rt-fadeonly-exit",
  collapse: true,
  collapseDuration: 220,
});
