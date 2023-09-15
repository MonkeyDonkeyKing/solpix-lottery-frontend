import anchor from "@coral-xyz/anchor";
import { SolpixLottery as LotteryProgram } from "@/lottery-program-build/types/0.1.0/solpix_lottery";

export type SolpixLottery = LotteryProgram;

export type Methods<T extends keyof anchor.Program<SolpixLottery>["methods"]> =
  T;
export type AccountParams<
  T extends keyof anchor.Program<SolpixLottery>["methods"]
> = Parameters<
  ReturnType<anchor.Program<SolpixLottery>["methods"][T]>["accounts"]
>[number];

export type InstructionParams<
  T extends keyof anchor.Program<SolpixLottery>["methods"]
> = Parameters<anchor.Program<SolpixLottery>["methods"][T]>[number];
