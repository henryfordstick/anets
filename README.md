# anets

JavaScript library about PPT complex animation. The [document address](https://anets.pages.dev/).

### Installation

The `anets.js` package lives in npm. To install the latest stable version, run the following command:

```bash
npm install anets
```

Or if you're using yarn:

```bash
yarn add anets
```

Import into your project:

```js
import anets from 'anets';
```

### Usage

```html
<div id="bigImages">
  <img src="./pic.jpeg" />
</div>
```

```js
const options = {
  item: '#bigImages',
  ani: {
    name: 'blindsInBOTTOM',
    duration: '2s',
  },
};

Anets.start(options, function (opts) {
  console.log(opts); // callback
});
```

You can use any element for the box and its elements, not just `img`.

### Options

```js
const anets = new Anet({
  item: '#bigImages',
  sound: 'music.mp3',
  audioElement: '#audio',
  ani: {
    cname: '百叶窗',
    name: 'blindsInBOTTOM',
    duration: '2s',
  },
  CanvasDOM: document.querySelector('canvas'),
  onStart: function (opts) {
    console.log(opts);
  },
  onEnd: function (opts) {
    console.log(opts);
  },
});
```

### License

Anets 是 [MIT 许可的](https://github.com/henryfordstick/anets/blob/main/LICENSE)。
