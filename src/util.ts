import { DispatchOptions, childClassName } from "./global";
import Anets from "./index";

const { pow, max, random, floor } = Math;

/**
 * 获取类型
 * @param {unknown} obj
 * @returns {string}
 */
function getType(obj: unknown): string {
  const type = typeof obj;
  if (type !== "object") {
    return type;
  }

  return Object.prototype.toString
    .call(obj)
    .replace(/^\[object (\S+)\]$/, "$1")
    .toLocaleLowerCase();
}

/**
 * requestAnimationFrame 兼容
 * @param {FrameRequestCallback} callback
 * @returns {number}
 */
function requestAnimationFrameCustom(callback: FrameRequestCallback): number {
  const animationFrame =
    window.requestAnimationFrame ||
    function (cb: FrameRequestCallback): number {
      return setTimeout(cb, 1000 / 60);
    };

  return animationFrame(callback);
}

/**
 * cancelAnimationFrame 兼容
 * @param {number} handle
 * @returns {void}
 */
function cancelAnimationFrameCustom(handle: number): void {
  const cancelFrame =
    window.cancelAnimationFrame ||
    function (id: number): void {
      clearTimeout(id);
    };
  return cancelFrame(handle);
}

/**
 * 添加全局样式
 */
function addGlobalStyle(): void {
  const style = document.createElement("style");
  style.innerHTML = `.${childClassName} {display: none}`;
  style.setAttribute("id", "anetStyle");
  document.head.appendChild(style);
}

/**
 * 移除元素
 * @param {Element} element
 */
function removeElement(element: Element): void {
  const parentElement = element.parentNode;
  parentElement?.removeChild(element);
}

/**
 * 添加钩子函数
 * @param {DispatchOptions} ref
 */
function dispatchEvent(ref: DispatchOptions): void {
  const { name, options, anets } = ref;
  const onName = "on" + name.charAt(0).toUpperCase() + name.substr(1);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (<any>options)[onName]?.call(anets ?? Anets, options);
}

function decLen(num: number): number {
  return String(num).split(".")[1]?.length ?? 0;
}

function reint(num: number): number {
  return ~~String(num).replace(".", "");
}

/**
 * 精确加法
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
function add(a: number, b: number): number {
  const pos = pow(10, max(decLen(a), decLen(b)));
  const res = (a * pos + b * pos) / pos;
  return res;
}

/**
 * 精确减法
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
function subtract(a: number, b: number): number {
  const bigLen = max(decLen(a), decLen(b));
  const pos = pow(10, bigLen);
  const res = ((a * pos - b * pos) / pos).toFixed(bigLen);
  return Number.parseFloat(res);
}

/**
 * 精确乘法
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
function multiply(a: number, b: number): number {
  const decLength = decLen(a) + decLen(b);
  return (reint(a) * reint(b)) / pow(10, decLength);
}

/**
 * 精确除法
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
function divide(a: number, b: number): number {
  const decLength = decLen(b) - decLen(a);
  return (reint(a) / reint(b)) * Math.pow(10, decLength);
}

/**
 * 获取随机数组
 * @param {number} len
 * @returns {number[]}
 */
function getRandomArrayList(len: number): number[] {
  const arrList = new Array(len).fill(0).map((_, i) => i);
  for (let i = arrList.length - 1; i > 0; --i) {
    const rdm = floor(random() * (i + 1));
    [arrList[i], arrList[rdm]] = [arrList[rdm], arrList[i]];
  }
  return arrList;
}

export {
  add,
  subtract,
  multiply,
  divide,
  removeElement,
  dispatchEvent,
  addGlobalStyle,
  getType,
  requestAnimationFrameCustom,
  cancelAnimationFrameCustom,
  getRandomArrayList,
};
