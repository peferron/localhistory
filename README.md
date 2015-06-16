# localhistory [![Build Status](https://travis-ci.org/peferron/localhistory.svg?branch=master)](https://travis-ci.org/peferron/localhistory) [![Coverage Status](https://coveralls.io/repos/peferron/localhistory/badge.svg)](https://coveralls.io/r/peferron/localhistory)

localhistory is a browser library that stores history into [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API).

* Prevents localStorage exceptions from reaching your code.
* Trims older entries to avoid saturating localStorage.
* ~1k minified & gzipped.
* No dependencies.

localhistory was initially developed for adding history features to language playgrounds. If you are interested in that, check out the [playbyplay repository](https://github.com/peferron/playbyplay).

A [very simple demo](https://rawgit.com/peferron/localhistory/master/demo/index.html) is available in the `demo` directory.

# Installation

1. Download `localhistory.min.js` from the `dist` directory.
2. Add it to your web page: `<script src="localhistory.min.js"></script>`

# Usage

## localhistory.append(key, entry, [options], [callback])

Appends an entry to history.

##### Arguments

* **`key`** is a string identifying the history to append to.
* **`entry`** is the value to append to history. `entry` can be any value [convertible to JSON](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify).
* **`[options]`** is an optional set of key/value pairs:
  * **`maxEntries`** is the maximum number of entries the history should keep. Defaults to 100.
  * **`maxBytes`** is the maximum number of bytes the history should use. Defaults to 100,000.
  * **`appendIfEqualToLast`** appends `entry` even if it is equal to the last history entry. Equality is determined by JSON comparison. Defaults to `true`.
* **`[callback]`** is an optional callback function, taking one argument:
  * **`err`** is `null` if the entry was appended successfully, or an `Error` object if the entry was not appended successfully.

##### Returns

A [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) that can be used instead of the callback.

##### Example

```js
var entry = {hello: 'world'};
localhistory.append('myhistory', entry);
```

##### Example with options

```js
var entry = {hello: 'world'};
localhistory.append('myhistory', entry, {maxEntries: 50});
```

## localhistory.load(key, callback)

Loads all entries previously appended to history.

##### Arguments

* **`key`** is a string identifying the history to load.
* **`callback`** is a callback function, taking two arguments:
  * **`err`** is `null` if the entries were loaded successfully, or an `Error` object if the entries were not loaded successfully.
  * **`entries`** is an `Array` containing the loaded entries, or `undefined` if the entries were not loaded successfully.

##### Returns

A `Promise` that can be used instead of the callback.

##### Example with callback

```js
localhistory.load('myhistory', function(err, entries) {
    if (err) {
        console.error('Load failed:', err);
        return;
    }
    console.log('Load succeeded:', entries);
});
```

##### Example with promise

```js
localhistory.load('myhistory').then(function(entries) {
    console.log('Load succeeded:', entries);
}).catch(function(err) {
    console.error('Load failed:', err);
});
```

##### Example for the adventurous

```js
const entries = await localhistory.load('myhistory');
```

## localhistory.clear(key, [callback])

Clears history, removing all entries.

##### Arguments

* **`key`** is a string identifying the history to clear.
* **`[callback]`** is an optional callback function, taking one argument:
  * **`err`** is `null` if the history was cleared successfully, or an `Error` object if the history was not cleared successfully.

##### Returns

A `Promise` that can be used instead of the callback.

##### Example

```js
localhistory.clear('myhistory');
```

## localhistory.supported

`true` if the browser supports localhistory, and `false` otherwise.

Required features:

* `localStorage` ([IE8]((http://caniuse.com/#feat=namevalue-storage))).
* `JSON` ([IE8](http://caniuse.com/#feat=json)).
* `Array.isArray` ([IE9]((https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray#Browser_compatibility)), add this [5-line polyfill](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray#Polyfill) before the localhistory `<script>` tag if you need IE8 support).

`Promise` support is optional. The API functions simply return `undefined` if the browser does not support promises. Use callbacks instead.

# Contributing

Install dependencies:

```shell
$ npm install
```

Lint and test:

```shell
$ npm test
```

Automatically run tests after each change:

```shell
$ npm run watch
```

[ES6+](https://github.com/lukehoban/es6features) is encouraged, but keep an eye on `dist_dev/playbyplay.js` to make sure the transpiled ES5 code does not become bloated by runtimes and polyfills.
