import lottery from "./lottery";
import lotteryManager from "./lotteryManager";
import programManager from "./programManager";

const methods = {
  programManager,
  lotteryManager,
  lottery,
};

export * as common from "./common";
export * as pdas from "./pdas";
export { methods };
export type { AccountParams, InstructionParams, Methods } from "./utilityTypes";
