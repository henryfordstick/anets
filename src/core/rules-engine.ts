// 擦除
const WipeDir = {
  [DIR.LEFT]: ANGLE.PI0, // 从左端
  [DIR.TOP]: ANGLE.PI90, // 从顶端
  [DIR.RIGHT]: ANGLE.PI180, // 从右端
  [DIR.BOTTOM]: ANGLE.PI270, // 从低端
};

// 劈裂
const BarnDir = {
  [TOP + BOTTOM + CENTER]: [maskOut, false, PI90], // 上下向中央收缩
  [CENTER + TOP + BOTTOM]: [maskIn, true, PI90], // 中央向上下展开
  [LEFT + RIGHT + CENTER]: [maskOut, false, PI0], // 左右向中央收缩
  [CENTER + LEFT + RIGHT]: [maskIn, true, PI0], // 中央向左右展开
};

// 棋盘
const CheckerboardDir = {
  [DIR.RIGHT]: ANGLE.PI90, // 跨
  [DIR.BOTTOM]: ANGLE.PI180, // 向下
};

// 百叶窗
const BlindsDir = {
  [DIR.BOTTOM]: ANGLE.PI90, // 水平
  [DIR.RIGHT]: ANGLE.PI0, // 垂直
};

// 溶解
const DissolveDir = {
  [ANITYPE.IN]: true, // 向内溶解
  [ANITYPE.OUT]: false, // 向外溶解
};

// 随机线条
const RandomBarDir = {
  [DIR.HORIZONTAL]: ANGLE.PI0, // 水平
  [DIR.VERTICAL]: ANGLE.PI90, // 垂直
};

// 阶梯
const StripsDir = {
  [DIR.LEFT + DIR.BOTTOM]: ANGLE.PI0, // 左下
  [DIR.LEFT + DIR.TOP]: ANGLE.PI90, // 左上
  [DIR.RIGHT + DIR.TOP]: ANGLE.PI180, // 右上
  [DIR.RIGHT + DIR.BOTTOM]: ANGLE.PI270, // 右下
};


