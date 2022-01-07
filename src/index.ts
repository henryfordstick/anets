import html2canvas from "html2canvas";
import {
  add,
  subtract,
  divide,
  multiply,
  dispatchEvent,
  addGlobalStyle,
  getType,
  getRandomArrayList,
  removeElement,
} from "./util";
import {
  AnetsOptions,
  audioName,
  childClassName,
  WHITECOLOR,
  BaseCanvas,
  ANGLE,
  Ani,
  TYPES,
  ANITYPE,
  DIR,
  COMPOSITE,
  TYPESENUM,
  ANIENUM,
  PerformArguments,
  PerformOptions,
  KeyOf,
} from "./global";
import { version } from "../package.json";

class Anets {
  private _options: AnetsOptions;

  private _callback: () => void;

  private _rafId!: number;

  private _target: string | null = null;

  private _currentEl: HTMLElement | null = null;

  private _canvas: HTMLCanvasElement | null = null;

  private _baseCanvas: BaseCanvas | null = null;

  static _instance: Anets | null = null;

  static readonly version: string = version;

  constructor(options: AnetsOptions, callback: () => void) {
    this._options = options;
    this._callback = callback;

    try {
      this._init();
    } catch (error) {
      callback.bind(null, options)();
      console.log((<Error>error).message);
    }
  }

  static start(options: AnetsOptions, callback: () => void): Anets {
    return new Anets(options, callback);
  }

  private async _init(): Promise<void> {
    const { item, sound, CanvasDOM } = this._options;

    dispatchEvent({
      name: "start",
      options: this._options,
    });

    if (this._target === item) {
      console.log("Don't repeat the call!");
    }

    this._target = item;

    addGlobalStyle();

    this._playAudio(sound);

    this._currentEl = this._getCurrentElement(item);

    this._canvas = CanvasDOM ?? (await this._htmlToCanvas());

    this._performSyncAnimation();
  }

  /**
   * 获取目标元素
   * @private
   * @param {string} item
   * @returns {HTMLElement}
   * @memberof Anets
   */
  private _getCurrentElement(item: string): HTMLElement {
    if (!item || getType(item) !== "string" || item === "") {
      throw new Error("Incorrect input of target element!");
    }
    return document.querySelector("#" + item) as HTMLElement;
  }

  /**
   * 播放音频资源
   *
   * @private
   * @param [source=""]
   * @returns {void}
   * @memberof Anets
   */
  private _playAudio(source = ""): void {
    if (source === "") return;
    const audioElement = this._options.audioElement ?? audioName;
    const audio = document.querySelector(
      `#${audioElement}`
    ) as HTMLAudioElement;
    audio.setAttribute("src", source.replace(".wav", ".mp3"));
    audio.setAttribute("loop", "true");
    audio.play();
  }

  /**
   * 创建 canvas
   *
   * @private
   * @param {number} width
   * @param {number} height
   * @returns {HTMLCanvasElement}
   * @memberof Anets
   */
  private _createCanvas(width: number, height: number): HTMLCanvasElement {
    const cvs = document.createElement("canvas");
    cvs.width = width;
    cvs.height = height;
    return cvs;
  }

  /**
   * 创建画布
   *
   * @private
   * @param {number} width
   * @param {number} height
   * @returns {BaseCanvas}
   * @memberof Anets
   */
  private _createBaseCanvas(width: number, height: number): BaseCanvas {
    const cvs = this._createCanvas(width, height);
    const cvsCtx = cvs.getContext("2d") as CanvasRenderingContext2D;
    cvsCtx.fillStyle = WHITECOLOR;
    return { cvs, cvsCtx };
  }

  /**
   * 旋转画布
   *
   * @private
   * @param {BaseCanvas} baseCanvas
   * @param {ANGLE} angle
   * @memberof Anets
   */
  private _rotateBaseCanvas(baseCanvas: BaseCanvas, angle: ANGLE) {
    const { cvs, cvsCtx } = baseCanvas;
    const { width, height } = cvs;
    switch (angle) {
      case ANGLE.PI90:
        cvsCtx.rotate(0.5 * Math.PI);
        cvsCtx.translate(0, -height);
        break;
      case ANGLE.PI180:
        cvsCtx.rotate(Math.PI);
        cvsCtx.translate(-width, -height);
        break;
      case ANGLE.PI270:
        cvsCtx.rotate(1.5 * Math.PI);
        cvsCtx.translate(-width, 0);
    }
  }

  /**
   * 子元素修改 className
   *
   * @private
   * @param {boolean} isShow
   * @returns {void}
   * @memberof Anets
   */
  private _currentToggleClassName(isShow: boolean): void {
    if (!this._currentEl) return;
    const child = this._currentEl.children as unknown as [];
    const Fun = isShow ? "add" : "remove";

    [...child].forEach((el: HTMLElement) => {
      el.classList[Fun](childClassName);
    });
  }

  /**
   * 处理时间
   *
   * @private
   * @param {Ani} ani
   * @returns {number}
   * @memberof Anets
   */
  private _getFrameRate(ani: Ani): number {
    const time = +ani.duration?.replace("s", "") ?? 0.1;
    return divide(1, multiply(60, time));
  }

  /**
   * DOM 转 canvas
   *
   * @private
   * @returns {Promise<BaseCanvas>}
   * @memberof Anets
   */
  private async _htmlToCanvas(): Promise<HTMLCanvasElement> {
    if (!this._currentEl) throw new Error("");
    const options = {
      logging: true,
      allowTaint: true,
      backgroundColor: null,
      useCORS: true,
    };

    const canvas = await html2canvas(this._currentEl, options);
    // html2canvas 的画布绘制不了
    return canvas;
  }

  /**
   * 开始执行动画
   *
   * @private
   * @returns {void}
   * @memberof Anets
   */
  private _performSyncAnimation(): void {
    if (!this._canvas) return;
    const { width, height } = this._canvas;
    const { cvs } = (this._baseCanvas = this._createBaseCanvas(width, height));
    // cvsCtx.drawImage(this._canvas, 0, 0);
    this._currentToggleClassName(true);
    this._currentEl?.appendChild(cvs);

    this._relevanceAnimation();
  }

  /**
   * 处理外部传入的资源
   *
   * @private
   * @param {Ani} ani
   * @memberof Anets
   */
  private _dealAniName(ani: Ani): {
    name: TYPES;
    aniType: ANITYPE;
    direction: Uppercase<DIR>;
  } {
    const aniName = ani.name;
    if (!aniName) throw new Error("Please enter the animation type");

    let arrName = aniName.split(/([A-Z][a-z]+)/).filter((item) => item);
    arrName = arrName.map((item) => item.toUpperCase());

    const name = arrName[0] as TYPESENUM;
    const type = arrName[1] as ANIENUM;
    const direction = arrName.slice(2);

    if (!TYPES[name]) throw new Error("The animation name cannot be empty");

    return {
      name: TYPES[name],
      aniType: ANITYPE[type],
      direction: direction?.join("") as Uppercase<DIR>,
    };
  }

  /**
   * 清理画布
   *
   * @private
   * @param {BaseCanvas} baseCanvas
   * @memberof Anets
   */
  private _clearRectCanvas(baseCanvas: BaseCanvas): void {
    const { cvs, cvsCtx } = baseCanvas;
    const { width, height } = cvs;
    cvsCtx.clearRect(-width, -height, 2 * width, 2 * height);
  }

  private _performBarAnimation(opts: PerformOptions): void {
    if (!this._canvas) return;
    const { cvs, cvsCtx } = this._baseCanvas as BaseCanvas;
    opts.speed = add(opts.speed, opts.size);

    this._rafId = requestAnimationFrame(
      this._performBarAnimation.bind(this, opts)
    );
    const speeds = !opts.aniType ? subtract(1, opts.speed) : opts.speed;
    if (speeds > 1 || speeds < 0) {
      this._exitAnets();
      return;
    }

    const baseCanvas = opts.applySlice.call(this, opts, speeds) as BaseCanvas;
    const baseCvs = baseCanvas.cvs;

    cvsCtx.save();
    cvsCtx.drawImage(this._canvas, 0, 0);
    cvsCtx.scale(cvs.width / baseCvs.width, cvs.height / baseCvs.height);
    cvsCtx.globalCompositeOperation = opts.composite;

    cvsCtx.drawImage(baseCvs, 0, 0);
    cvsCtx.restore();
  }

  /**
   * 关联动画执行函数
   */
  private _relevanceAnimation(): void {
    const aniArr = {
      [TYPES.WIPE]: this._wipeAnimation,
      [TYPES.BARN]: this._barnAnimation,
      [TYPES.CHECKERBOARD]: this._checkerboardAnimation,
      [TYPES.BLINDS]: this._blindsAnimation,
      [TYPES.DISSOLVE]: this._dissolveAnimation,
      [TYPES.RANDOMBAR]: this._randomBarAnimation,
      [TYPES.STRIPS]: this._stripsAnimation,
      [TYPES.WEDGE]: this._wedgeAnimation,
      [TYPES.WHEEL]: this._wheelAnimation,
      [TYPES.BOX]: this._boxAnimation,
      [TYPES.CIRCLE]: this._circleAnimation,
      [TYPES.DIAMOND]: this._diamondAnimation,
      [TYPES.PLUS]: this._plusAnimation,
    };
    const { ani } = this._options;
    const { name, aniType, direction } = this._dealAniName(ani);
    const size = this._getFrameRate(ani);
    aniArr[name]?.call(this, { aniType, size, direction });
  }

  /**
   * 擦除
   *
   * @private
   * @param {PerformArguments} args
   * @memberof Anets
   */
  private _wipeAnimation(args: PerformArguments): void {
    const { aniType, size, direction } = args;
    const dir = {
      [DIR.LEFT]: ANGLE.PI0, // 从左端
      [DIR.TOP]: ANGLE.PI90, // 从顶端
      [DIR.RIGHT]: ANGLE.PI180, // 从右端
      [DIR.BOTTOM]: ANGLE.PI270, // 从低端
    };

    const types = aniType === ANITYPE.IN;
    const opts: PerformOptions = {
      size,
      speed: 0,
      aniType: types,
      angle: dir[<KeyOf<typeof dir>>DIR[direction]],
      composite: types ? COMPOSITE.maskIn : COMPOSITE.maskOut,
      applySlice: this._applyWipeSlice,
      maskCanvas: this._createBaseCanvas(100, 100),
      radios: 0,
    };

    this._rotateBaseCanvas(opts.maskCanvas as BaseCanvas, opts.angle as ANGLE);
    this._performBarAnimation(opts);
  }

  private _applyWipeSlice(opts: PerformOptions) {
    const maskCanvas = opts.maskCanvas as BaseCanvas;
    const { cvs, cvsCtx } = maskCanvas;
    const { width, height } = cvs;

    this._clearRectCanvas(maskCanvas);

    cvsCtx.fillRect(0, 0, width * opts.speed, height);
    return maskCanvas;
  }

  /**
   * 劈裂
   * @param args
   * @private
   */
  private _barnAnimation(args: PerformArguments): void {
    const { aniType, size, direction } = args;
    const { maskOut, maskIn } = COMPOSITE;
    const { TOP, BOTTOM, CENTER, LEFT, RIGHT } = DIR;
    const { PI0, PI90 } = ANGLE;
    const dir = {
      [TOP + BOTTOM + CENTER]: [maskOut, false, PI90], // 上下向中央收缩
      [CENTER + TOP + BOTTOM]: [maskIn, true, PI90], // 中央向上下展开
      [LEFT + RIGHT + CENTER]: [maskOut, false, PI0], // 左右向中央收缩
      [CENTER + LEFT + RIGHT]: [maskIn, true, PI0], // 中央向左右展开
    };

    const opts: PerformOptions = {
      size,
      speed: 0,
      angle: ANGLE.PI0,
      composite: maskIn,
      applySlice: this._applyBarnSlice,
      maskCanvas: this._createBaseCanvas(100, 100),
    };

    [opts.composite, opts.aniType, opts.angle] = dir[
      direction.toLocaleLowerCase()
    ] as [COMPOSITE, boolean, ANGLE];

    if (aniType === ANITYPE.OUT) {
      opts.composite = opts.composite === maskIn ? maskOut : maskIn;
    }

    this._rotateBaseCanvas(opts.maskCanvas as BaseCanvas, opts.angle);
    this._performBarAnimation(opts);
  }

  private _applyBarnSlice(opts: PerformOptions, speed: number): BaseCanvas {
    const maskCanvas = opts.maskCanvas as BaseCanvas;
    const { cvs, cvsCtx } = maskCanvas;
    const { width, height } = cvs;

    this._clearRectCanvas(maskCanvas);
    speed *= width;
    cvsCtx.fillRect(width / 2 - speed / 2, 0, speed, height);
    return maskCanvas;
  }

  /**
   * 棋盘
   * @param args
   * @private
   */
  private _checkerboardAnimation(args: PerformArguments): void {
    const { aniType, size, direction } = args;
    const dir = {
      [DIR.RIGHT]: ANGLE.PI90, // 跨
      [DIR.BOTTOM]: ANGLE.PI180, // 向下
    };

    const opts: PerformOptions = {
      size,
      speed: 0,
      aniType: aniType === ANITYPE.IN,
      angle: dir[<KeyOf<typeof dir>>DIR[direction]],
      ratioX: 6,
      ratioY: 6,
      composite: COMPOSITE.maskIn,
      applySlice: this._applyBlindSlice,
    };

    opts.maskCanvas = this._processBlindsPieces(opts);
    this._performBarAnimation(opts);
  }

  /**
   * 百叶窗
   * @param args
   * @private
   */
  private _blindsAnimation(args: PerformArguments): void {
    const { aniType, size, direction } = args;
    const dir = {
      [DIR.BOTTOM]: ANGLE.PI90, // 水平
      [DIR.RIGHT]: ANGLE.PI0, // 垂直
    };
    const opts: PerformOptions = {
      size,
      speed: 0,
      aniType: aniType === ANITYPE.IN,
      angle: dir[<KeyOf<typeof dir>>DIR[direction]],
      ratioX: 6,
      ratioY: 1,
      composite: COMPOSITE.maskIn,
      applySlice: this._applyBlindSlice,
    };

    opts.maskCanvas = this._processBlindsPieces(opts);
    this._performBarAnimation(opts);
  }

  private _applyBlindSlice(opts: PerformOptions, speed: number): BaseCanvas {
    const { maskCanvas, ratioX, ratioY } = opts as Required<PerformOptions>;
    const { baseCanvas, sliceCanvas, foilCanvas } = maskCanvas as {
      [key: string]: BaseCanvas;
    };

    this._clearRectCanvas(baseCanvas);

    const sliceCvs = sliceCanvas.cvs;
    const sliceContext = sliceCanvas.cvsCtx;

    const sliceWidth = sliceCvs.width;
    const sliceHeight = sliceCvs.height;

    sliceContext.clearRect(0, 0, sliceWidth, sliceHeight);
    sliceContext.fillStyle = WHITECOLOR;
    sliceContext.fillRect(0, 0, speed * sliceWidth, sliceHeight);

    const foilContext = foilCanvas.cvsCtx;
    const foilCvs = foilCanvas.cvs;
    foilContext.clearRect(0, 0, foilCvs.width, foilCvs.height);

    for (let i = 0; i < ratioX + 1; ++i) {
      foilContext.drawImage(sliceCvs, sliceWidth * i, 0);
    }

    const baseContext = baseCanvas.cvsCtx;
    for (let j = 0; j < ratioY; ++j) {
      // 棋盘
      baseContext.drawImage(
        foilCvs,
        j % 2 ? -sliceWidth / 2 : 0,
        j * foilCvs.height
      );
    }

    return baseCanvas;
  }

  /**
   * 处理 遮罩 canvas
   * @param {*} opts
   * @returns
   */
  private _processBlindsPieces(opts: PerformOptions): {
    [key: string]: BaseCanvas;
  } {
    const { angle, ratioX, ratioY } = opts as Required<PerformOptions>;
    const baseCanvas = this._createBaseCanvas(102, 102);
    const { cvs } = baseCanvas;
    // 旋转画布
    this._rotateBaseCanvas(baseCanvas, angle);

    const sliceWidth = Math.ceil(cvs.width / ratioX);
    const sliceHeight = Math.ceil(cvs.height / ratioY);
    const sliceCanvas = this._createBaseCanvas(sliceWidth, sliceHeight);
    const foilCanvas = this._createBaseCanvas(
      cvs.width + sliceWidth,
      sliceHeight
    );

    return {
      baseCanvas,
      sliceCanvas,
      foilCanvas,
    };
  }

  /**
   * 溶解
   * @param args
   * @private
   */
  private _dissolveAnimation(args: PerformArguments): void {
    const { aniType, size } = args;
    const { maskIn, maskOut } = COMPOSITE;
    const dir = {
      [ANITYPE.IN]: true, // 向内溶解
      [ANITYPE.OUT]: false, // 向外溶解
    };

    const types =
      dir[<KeyOf<typeof dir>>ANITYPE[aniType as unknown as Uppercase<ANITYPE>]];

    const opts: PerformOptions = {
      size,
      speed: 0,
      composite: types ? maskIn : maskOut,
      aniType: types,
      applySlice: this._applyDissolveSlice,
    };
    opts.maskCanvas = this._processDissolvePieces();

    this._performBarAnimation(opts);
  }

  private _applyDissolveSlice(opts: PerformOptions): BaseCanvas {
    const { baseCanvas, randomList, canvasList, randomArr } =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      opts.maskCanvas as any;
    const { cvsCtx } = baseCanvas as BaseCanvas;
    const { floor } = Math;
    this._clearRectCanvas(<BaseCanvas>baseCanvas);

    let speed = opts.speed;
    speed = floor(100 * speed);

    for (let i = 0; i < randomList.length; ++i) {
      const randomItem = randomList[i];
      const canvasItem = canvasList[i];
      const ctxItem = canvasItem.cvsCtx;

      ctxItem.clearRect(0, 0, 20, 20);
      ctxItem.fillStyle = WHITECOLOR;
      for (let j = 0; j < speed; ++j) {
        const rdmItem = randomItem[j];
        ctxItem.fillRect(2 * floor(rdmItem / 10), (rdmItem % 10) * 2, 2, 2);
      }
    }

    for (let i = 0; i < 5; ++i) {
      const ratioI = i * 20;
      for (let j = 0; j < 5; ++j) {
        cvsCtx.drawImage(canvasList[randomArr[5 * i + j]].cvs, ratioI, j * 20);
      }
    }

    return baseCanvas;
  }

  private _processDissolvePieces() {
    const baseCanvas = this._createBaseCanvas(100, 100);
    const randomList = [];
    const canvasList = [];

    for (let i = 0; i < 5; ++i) {
      randomList.push(getRandomArrayList(100));
      canvasList.push(this._createBaseCanvas(20, 20));
    }

    const randomArr = getRandomArrayList(25);
    for (let j = 0; j < randomArr.length; ++j) {
      randomArr[j] %= 5;
    }
    return {
      baseCanvas,
      randomList,
      canvasList,
      randomArr,
    };
  }

  /**
   * 随机线条
   * @param args
   * @private
   */
  private _randomBarAnimation(args: PerformArguments): void {
    const { aniType, size, direction } = args;
    const { maskIn, maskOut } = COMPOSITE;
    const dir = {
      [DIR.HORIZONTAL]: ANGLE.PI0, // 水平
      [DIR.VERTICAL]: ANGLE.PI90, // 垂直
    };

    const composite = aniType === ANITYPE.IN ? maskIn : maskOut;

    const opts: PerformOptions = {
      size,
      speed: 0,
      angle: dir[<KeyOf<typeof dir>>DIR[direction]],
      composite,
      applySlice: this._applyRandomBarSlice,
    };

    opts.maskCanvas = this._processRandomBarPieces(opts);

    this._performBarAnimation(opts);
  }

  private _applyRandomBarSlice(opts: PerformOptions) {
    const { baseCanvas, randomArr } = opts.maskCanvas as {
      baseCanvas: BaseCanvas;
      randomArr: number[];
    };
    const { cvs, cvsCtx } = baseCanvas;
    const { floor } = Math;

    this._clearRectCanvas(baseCanvas);

    let speed = opts.speed;
    speed = floor(100 * speed);
    for (let i = 0; i < speed; ++i) {
      cvsCtx.fillRect(0, randomArr[i], cvs.width, 1);
    }
    return baseCanvas;
  }

  private _processRandomBarPieces(opts: PerformOptions) {
    const baseCanvas = this._createBaseCanvas(100, 100);
    const randomArr = getRandomArrayList(100);
    this._rotateBaseCanvas(baseCanvas, opts.angle as ANGLE);
    return { baseCanvas, randomArr };
  }

  /**
   * 阶梯
   * @param args
   * @private
   */
  private _stripsAnimation(args: PerformArguments): void {
    const { aniType, size, direction } = args;
    const dir = {
      [DIR.LEFT + DIR.BOTTOM]: ANGLE.PI0, // 左下
      [DIR.LEFT + DIR.TOP]: ANGLE.PI90, // 左上
      [DIR.RIGHT + DIR.TOP]: ANGLE.PI180, // 右上
      [DIR.RIGHT + DIR.BOTTOM]: ANGLE.PI270, // 右下
    };

    const opts: PerformOptions = {
      size,
      speed: 0,
      aniType: aniType === ANITYPE.OUT,
      angle: dir[direction.toLocaleLowerCase()],
      composite: COMPOSITE.maskOut,
      applySlice: this._applyStripSlice,
    };

    opts.maskCanvas = this._processStripPieces(opts);

    this._performBarAnimation(opts);
  }

  private _applyStripSlice(opts: PerformOptions, speed: number) {
    const { baseCanvas, sliceCanvas } = opts.maskCanvas as {
      [key: string]: BaseCanvas;
    };
    this._clearRectCanvas(baseCanvas);
    baseCanvas.cvsCtx.drawImage(sliceCanvas.cvs, -192 * (1 - speed), 0);

    return baseCanvas;
  }

  private _processStripPieces(opts: PerformOptions) {
    const baseCanvas = this._createBaseCanvas(96, 96);
    const sliceCanvas = this._createBaseCanvas(192, 96);
    const sliceCtx = sliceCanvas.cvsCtx;

    sliceCtx.fillRect(0, 0, 96, 96);
    sliceCtx.translate(96, 0);
    for (let i = 0; i < 16; ++i) {
      // sliceCtx.fillRect(0, i * 6, i * 6, 6)
      sliceCtx.fillRect(0, i * 6, i * 6, 6);
    }

    this._rotateBaseCanvas(baseCanvas, <ANGLE>opts.angle);
    return { baseCanvas, sliceCanvas };
  }

  /**
   * 楔入
   * @param args
   * @private
   */
  private _wedgeAnimation(args: PerformArguments): void {
    const { aniType, size } = args;
    const { maskIn, maskOut } = COMPOSITE;
    const dir = {
      [ANITYPE.IN]: false, // 出现
      [ANITYPE.OUT]: true, // 消失
    };
    const types: boolean =
      dir[
        <KeyOf<typeof dir>>ANITYPE[aniType.toUpperCase() as Uppercase<ANITYPE>]
      ];
    const opts: PerformOptions = {
      size,
      speed: 0,
      aniType: types,
      composite: !types ? maskIn : maskOut,
      applySlice: this._applyWedgeSlice,
    };

    opts.maskCanvas = this._processWedgePieces();

    this._performBarAnimation(opts);
  }

  private _applyWedgeSlice(opts: PerformOptions): BaseCanvas {
    const maskCanvas = opts.maskCanvas as BaseCanvas;
    const { cvs, cvsCtx } = maskCanvas;

    this._clearRectCanvas(maskCanvas);
    const width = cvs.width;
    let speed = opts.speed;
    speed *= Math.PI;
    cvsCtx.save();
    cvsCtx.translate(width / 2, width / 2);
    cvsCtx.beginPath();
    cvsCtx.moveTo(0, 0);
    cvsCtx.arc(0, 0, width, -speed, speed, !1);
    cvsCtx.lineTo(0, 0);
    cvsCtx.fill();
    cvsCtx.restore();
    return maskCanvas;
  }

  private _processWedgePieces(): BaseCanvas {
    const baseCanvas = this._createBaseCanvas(100, 100);
    this._rotateBaseCanvas(baseCanvas, ANGLE.PI270);
    return baseCanvas;
  }

  /**
   * 轮子-出现
   * @param args
   * @private
   */
  private _wheelAnimation(args: PerformArguments): void {
    const { aniType, size, direction } = args;
    const { ONE, TWO, THREE, FOUR, EIGHT, SPOKES } = DIR;
    const { maskIn, maskOut } = COMPOSITE;
    const dir = {
      [ONE + SPOKES]: 1, // 一轮辐
      [TWO + SPOKES]: 2, // 二轮辐
      [THREE + SPOKES]: 3, // 三轮辐
      [FOUR + SPOKES]: 4, // 四轮辐
      [EIGHT + SPOKES]: 8, // 八轮辐
    };

    const opts: PerformOptions = {
      size,
      speed: 0,
      angle: dir[direction.toLocaleLowerCase()] as unknown as ANGLE,
      aniType: true,
      composite: aniType === ANITYPE.IN ? maskIn : maskOut,
      applySlice: this._applyWheelSlice,
    };

    opts.maskCanvas = this._processWheelPieces();

    this._performBarAnimation(opts);
  }

  private _applyWheelSlice(opts: PerformOptions, speed: number): BaseCanvas {
    const maskCanvas = opts.maskCanvas as BaseCanvas;
    const { cvs, cvsCtx } = maskCanvas;
    this._clearRectCanvas(maskCanvas);
    const width = cvs.width;
    const angle = opts.angle as unknown as number;
    const radios = (2 * Math.PI) / angle;
    speed *= radios;
    cvsCtx.save();
    cvsCtx.translate(width / 2, width / 2);
    cvsCtx.beginPath();
    for (let i = 0; i < angle; ++i) {
      const rise = i * radios;
      cvsCtx.moveTo(0, 0);
      cvsCtx.arc(0, 0, width, rise, rise + speed, !1);
      cvsCtx.lineTo(0, 0);
    }
    cvsCtx.fill();
    cvsCtx.restore();
    return maskCanvas;
  }

  private _processWheelPieces() {
    const baseCanvas = this._createBaseCanvas(100, 100);
    this._rotateBaseCanvas(baseCanvas, ANGLE.PI270);
    return baseCanvas;
  }

  /**
   * 盒状
   * @param args
   * @private
   */
  private _boxAnimation(args: PerformArguments): void {
    const { aniType, size, direction } = args;
    const opts: PerformOptions = {
      size,
      speed: 0,
      aniType,
      composite: direction,
      applySlice: this._applyBoxSlice,
    };

    opts.maskCanvas = this._processShapePieces(opts);

    this._performBarAnimation(opts);
  }

  private _applyBoxSlice(opts: PerformOptions, speed: number): BaseCanvas {
    const maskCanvas = opts.maskCanvas as BaseCanvas;
    const { cvs, cvsCtx } = maskCanvas;
    this._clearRectCanvas(maskCanvas);

    let width = cvs.width;
    speed *= cvs.width;
    width = (width - speed) / 2;
    cvsCtx.fillRect(width, width, speed, speed);
    return maskCanvas;
  }

  private _processShapePieces(opts: PerformOptions): BaseCanvas {
    const baseCanvas = this._createBaseCanvas(100, 100);
    const { maskIn, maskOut } = COMPOSITE;
    const dir = {
      [ANITYPE.IN + DIR.IN]: [false, maskOut],
      [ANITYPE.IN + DIR.OUT]: [true, maskIn],
      [ANITYPE.OUT + DIR.IN]: [true, maskOut],
      [ANITYPE.OUT + DIR.OUT]: [false, maskIn],
    };

    [opts.aniType, opts.composite] = dir[
      <KeyOf<typeof dir>>(
        (ANITYPE[<Uppercase<ANITYPE>>(<string>opts.aniType).toUpperCase()] +
          DIR[<Uppercase<DIR>>opts.composite])
      )
    ] as [boolean, COMPOSITE];
    return baseCanvas;
  }

  /**
   * 圆
   * @param args
   * @private
   */
  private _circleAnimation(args: PerformArguments): void {
    const { aniType, size, direction } = args;
    const { ceil, sqrt } = Math;
    const opts: PerformOptions = {
      size,
      speed: 0,
      aniType,
      composite: direction,
      applySlice: this._applyCircleSlice,
    };

    opts.maskCanvas = this._processShapePieces(opts);
    const halfWidth = (<BaseCanvas>opts.maskCanvas).cvs.width / 2;
    opts.radios = ceil(sqrt(2 * halfWidth * halfWidth));
    this._performBarAnimation(opts);
  }

  private _applyCircleSlice(opts: PerformOptions, speed: number): BaseCanvas {
    const maskCanvas = opts.maskCanvas as BaseCanvas;
    const { cvs, cvsCtx } = maskCanvas;
    this._clearRectCanvas(maskCanvas);

    const halfWidth = cvs.width / 2;
    speed *= opts.radios as number;
    cvsCtx.beginPath();
    cvsCtx.arc(halfWidth, halfWidth, speed, 0, 2 * Math.PI, !1);
    cvsCtx.fill();
    return maskCanvas;
  }

  /**
   * 菱形
   * @param args
   * @private
   */
  private _diamondAnimation(args: PerformArguments): void {
    const { aniType, size, direction } = args;

    const opts: PerformOptions = {
      size,
      speed: 0,
      aniType,
      composite: direction,
      applySlice: this._applyDiamondSlice,
    };

    const { cvs, cvsCtx } = (opts.maskCanvas = this._processShapePieces(opts));
    const halfWidth = cvs.width / 2;
    cvsCtx.translate(halfWidth, halfWidth);
    this._performBarAnimation(opts);
  }

  private _applyDiamondSlice(opts: PerformOptions, speed: number): BaseCanvas {
    const maskCanvas = opts.maskCanvas as BaseCanvas;
    const { cvs, cvsCtx } = maskCanvas;

    this._clearRectCanvas(maskCanvas);
    speed *= cvs.width;
    cvsCtx.beginPath();
    cvsCtx.moveTo(-speed, 0);
    cvsCtx.lineTo(0, speed);
    cvsCtx.lineTo(speed, 0);
    cvsCtx.lineTo(0, -speed);
    cvsCtx.fill();
    return maskCanvas;
  }

  /**
   * 十字扩展
   * @param args
   * @private
   */
  private _plusAnimation(args: PerformArguments): void {
    const { aniType, size, direction } = args;

    const opts: PerformOptions = {
      size,
      speed: 0,
      aniType,
      composite: direction,
      applySlice: this._applyPlusSlice,
    };

    opts.maskCanvas = this._processShapePieces(opts);

    this._performBarAnimation(opts);
  }

  private _applyPlusSlice(opts: PerformOptions, speed: number): BaseCanvas {
    const maskCanvas = opts.maskCanvas as BaseCanvas;
    const { cvs, cvsCtx } = maskCanvas;

    this._clearRectCanvas(maskCanvas);

    const width = cvs.width;
    const halfWidth = width / 2;

    speed *= width;
    cvsCtx.fillRect(0, halfWidth - speed / 2, width, speed);
    cvsCtx.fillRect(halfWidth - speed / 2, 0, speed, width);
    return maskCanvas;
  }

  private _exitAnets() {
    cancelAnimationFrame(this._rafId);
    const anetStyle = document.head.querySelector("#anetStyle");
    removeElement(<Element>anetStyle);
    dispatchEvent({
      name: "end",
      options: this._options,
    });
    removeElement(<HTMLCanvasElement>this._baseCanvas?.cvs);
    this._currentToggleClassName(false);
    this._callback?.bind(null, this._options)();
    this._target = null;
    this._currentEl = null;
    this._canvas = null;
    this._baseCanvas = null;
  }
}

export default Anets;
