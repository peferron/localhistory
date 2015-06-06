# playbyplay-core

Playbyplay is a history library for language playgrounds, with a focus on being a good citizen:

* Prevents all localStorage exceptions from reaching your code.
* Trims down history to avoid saturating localStorage.
* ~1k minified & gzipped.
* No dependencies.

This repo hosts the core Playbyplay library, suitable if you want to implement your own UI from scratch. If you would rather start from a prebuilt UI, check out [playbyplay-ui](https://github.com/peferron/playbyplay-ui).

A [very simple demo](https://cdn.rawgit.com/peferron/playbyplay-core/master/demo/index.html) is available in the `demo` directory.

# Installation

1. Download `playbyplay.min.js` from the `dist` directory.
2. Add it to your web page: `<script src="playbyplay.min.js"></script>`

# Usage

## playbyplay.save(run, [callback])

Saves a run to history.

`save` is asynchronous and will not block immediate rendering. Feel free to `save` immediately after receiving the output.

##### Arguments

* **`run`** is the value to save to history. `run` can be any value [convertible to JSON](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify).
* **`[callback]`** is an optional callback function, taking one argument:
  * **`err`** is `null` if the run was saved successfully, or an `Error` object if the run was not saved successfully.

##### Returns

A [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) that can be used instead of the callback, if [your browser supports it](http://caniuse.com/#feat=promises).

##### Example

```js
var run = {input: 'Hello World', output: '42'};
playbyplay.save(run);
```

## playbyplay.load(callback)

Loads runs previously saved to history.

##### Arguments

* **`callback`** is a callback function, taking two arguments:
  * **`err`** is `null` if the runs were loaded successfully, or an `Error` object if the runs were not loaded successfully.
  * **`runs`** is an `Array` containing the loaded runs, or `undefined` if the runs were not loaded successfully.

##### Returns

A `Promise` that can be used instead of the callback, if your browser supports it.

##### Example with callback

```js
playbyplay.load(function(err, runs) {
    if (err) {
        console.error('Load failed:', err);
        return;
    }
    console.log('Load succeeded:', runs);
});
```

##### Example with promise

```js
playbyplay.load().then(function(runs) {
    console.log('Load succeeded:', runs);
}).catch(function(err) {
    console.error('Load failed:', err);
});
```

##### Example for the adventurous

```js
const runs = await playbyplay.load();
```

## playbyplay.clear([callback])

Clears history, removing all saved runs.

##### Arguments

* **`[callback]`** is an optional callback function, taking one argument:
  * **`err`** is `null` if the history was cleared successfully, or an `Error` object if the history was not cleared successfully.

##### Returns

A `Promise` that can be used instead of the callback, if your browser supports it.

##### Example

```js
playbyplay.clear();
```

# Contributing

Install dependencies:

```shell
$ npm install
```

Run tests:

```shell
$ npm test
```

Automatically run tests after each change:

```shell
$ npm run watch
```
