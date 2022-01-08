import Anets from "./index";
export enum TYPES {
  /** @擦除 */ WIPE = "wipe",
  /** @劈裂 */ BARN = "barn",
  /** @棋盘 */ CHECKERBOARD = "checkerboard",
  /** @百叶窗 */ BLINDS = "blinds",
  /** @溶解 */ DISSOLVE = "dissolve",
  /** @随机线条 */ RANDOMBAR = "randombar",
  /** @阶梯状 */ STRIPS = "strips",
  /** @扇形 */ WEDGE = "wedge",
  /** @轮子 */ WHEEL = "wheel",
  /** @盒状 */ BOX = "box",
  /** @圆形扩展 */ CIRCLE = "circle",
  /** @菱形 */ DIAMOND = "diamond",
  /** @十字扩展 */ PLUS = "plus",
}

export enum DIR {
  IN = "in",
  OUT = "out",
  LEFT = "left",
  RIGHT = "right",
  TOP = "top",
  BOTTOM = "bottom",
  UP = "up",
  DOWN = "down",
  HORIZONTAL = "horizontal",
  VERTICAL = "vertical",
  CENTER = "center",
  ONE = "one",
  TWO = "two",
  THREE = "three",
  FOUR = "four",
  EIGHT = "eight",
  SPOKES = "spokes",
}

export enum ANITYPE {
  IN = "in",
  ACTION = "action",
  OUT = "out",
}

export enum ANGLE {
  "PI0" = "0",
  "PI90" = "90",
  "PI180" = "180",
  "PI270" = "270",
}

export enum COMPOSITE {
  "maskIn" = "destination-in",
  "maskOut" = "destination-out",
}

export const WHITECOLOR = "rgba(255,255,255,1)";

export const childClassName = "anets-item";
export const audioName = "ani-audio";

export interface AnetsOptions {
  item: string;
  sound?: string;
  audioElement?: string;
  CanvasDOM?: HTMLCanvasElement;
  ani: Ani;
  onStart?: (options: AnetsOptions) => void;
  onEnd?: (options: AnetsOptions) => void;
  // [name: string]: string;
}

export interface DispatchOptions {
  name: string;
  options: AnetsOptions;
  event?: Event;
  anets?: typeof Anets;
}

export interface BaseCanvas {
  cvs: HTMLCanvasElement;
  cvsCtx: CanvasRenderingContext2D;
}

type AnyEnumAsKeys<T> = keyof T;

type CL<T extends string> = Capitalize<Lowercase<T>>;

export type TYPESENUM = AnyEnumAsKeys<typeof TYPES>;
export type ANIENUM = AnyEnumAsKeys<typeof ANITYPE>;
export type DIRENUM = AnyEnumAsKeys<typeof DIR>;

type AniName = `${Lowercase<TYPESENUM>}${CL<ANIENUM>}${CL<DIRENUM> | never}`;

export interface Ani {
  name: AniName;
  duration: string;
  [name: string]: PropertyKey;
}

export interface AniNameParams {
  name: ANITYPE;
  size: number;
}

export interface PerformArguments {
  aniType: ANITYPE;
  size: number;
  direction: Uppercase<DIR>;
}

export interface PerformOptions {
  direction?: DIR;
  size: number;
  radios?: number;
  applySlice: (opts: PerformOptions, speeds: number) => unknown;
  speed: number;
  composite: COMPOSITE | Uppercase<DIR>;
  aniType?: ANITYPE | boolean;
  maskCanvas?: unknown;
  angle?: ANGLE;
  ratioX?: number;
  ratioY?: number;
}

export type KeyOf<T> = keyof T;
