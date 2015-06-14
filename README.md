# localhistory

`localhistory` is a browser library that stores history into [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API).

* Prevents localStorage exceptions from reaching your code.
* Trims older entries to avoid saturating localStorage.
* ~1k minified & gzipped.
* No dependencies.

`localhistory` was initially developed for adding history features to language playgrounds. If you are interested in that, check out the [playbyplay repository](https://github.com/peferron/playbyplay).

A [very simple demo](https://cdn.rawgit.com/peferron/localhistory/master/demo/index.html) is available in the `demo` directory.

# Installation

1. Download `localhistory.min.js` from the `dist` directory.
2. Add it to your web page: `<script src="localhistory.min.js"></script>`

# Usage

## localhistory.append(run, [options], [callback])

Appends a run to history.

`append` is asynchronous and will not block immediate rendering. Feel free to `append` a run immediately after receiving the output.

##### Arguments

* **`run`** is the value to append to history. `run` can be any value [convertible to JSON](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify).
* **`[options]`** is an optional set of key/value pairs:
  * **`maxRuns`** is the maximum number of runs the history should keep. Defaults to 100.
  * **`maxBytes`** is the maximum number of bytes the history should use. Defaults to 100,000.
* **`[callback]`** is an optional callback function, taking one argument:
  * **`err`** is `null` if the run was appended successfully, or an `Error` object if the run was not appended successfully.

##### Returns

A [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) that can be used instead of the callback, if [your browser supports it](http://caniuse.com/#feat=promises).

##### Example

```js
var run = {input: 'Hello World', output: '42'};
localhistory.append(run);
```

##### Example with options

```js
var run = {input: 'Hello World', output: '42'};
localhistory.append(run, {maxRuns: 50});
```

## localhistory.load(callback)

Loads runs previously appended to history.

##### Arguments

* **`callback`** is a callback function, taking two arguments:
  * **`err`** is `null` if the runs were loaded successfully, or an `Error` object if the runs were not loaded successfully.
  * **`runs`** is an `Array` containing the loaded runs, or `undefined` if the runs were not loaded successfully.

##### Returns

A `Promise` that can be used instead of the callback, if your browser supports it.

##### Example with callback

```js
localhistory.load(function(err, runs) {
    if (err) {
        console.error('Load failed:', err);
        return;
    }
    console.log('Load succeeded:', runs);
});
```

##### Example with promise

```js
localhistory.load().then(function(runs) {
    console.log('Load succeeded:', runs);
}).catch(function(err) {
    console.error('Load failed:', err);
});
```

##### Example for the adventurous

```js
const runs = await localhistory.load();
```

## localhistory.clear([callback])

Clears history, removing all runs.

##### Arguments

* **`[callback]`** is an optional callback function, taking one argument:
  * **`err`** is `null` if the history was cleared successfully, or an `Error` object if the history was not cleared successfully.

##### Returns

A `Promise` that can be used instead of the callback, if your browser supports it.

##### Example

```js
localhistory.clear();
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
