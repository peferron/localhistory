# playbyplay-core

LocalStorage history for language playgrounds.

This is the barebones library, suitable if you want to implement your own UI from scratch. If you would rather use a prebuilt UI, check out [playbyplay-ui](https://github.com/peferron/playbyplay-ui).

# Demo

A [very simple demo](https://cdn.rawgit.com/peferron/playbyplay-core/master/demo/index.html) is available in the `demo` directory.

# Installation

1. Download `playbyplay.min.js` from the `dist` directory.
2. Add it to your web page: `<script src="playbyplay.min.js"></script>`

# Usage

## playbyplay.save(run, [callback])

Saves a run to history. 

`save` is asynchronous and will not block immediate rendering. Feel free to `save` immediately after receiving the output.

Arguments:

* **`run`** is the value to save to history. `run` can be any value [convertible to JSON](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify).
* **`callback`** is an optional callback function, taking one argument:  
  * **`err`** is `null` if the run was saved successfully, or an `Error` object if the run was not saved successfully.

Example:

```js
var run = {input: 'Hello World', output: '42'};
playbyplay.save(run);
```

Example with callback:

```js
var run = {input: 'Hello World', output: '42'};
playbyplay.save(run, function(err) {
    if (err) {
        console.error('Save failed:', err);
        return;
    }
    console.log('Save succeeded');
});
```

## playbyplay.load(callback)

Loads runs previously saved to history.

Arguments:

* **`callback`** is a callback function, taking two arguments:
  * **`err`** is `null` if the runs were loaded successfully, or an `Error` object if the runs were not loaded successfully.
  * **`runs`** is an `Array` containing the loaded runs, or `undefined` if the runs were not loaded successfully.

Example:

```js
playbyplay.load(function(err, runs) {
    if (err) {
        console.error('Load failed:', err);
        return;
    }
    console.log('Load succeeded:', runs);
});
```

## playbyplay.clear([callback])

Clears history, removing all saved runs.

Arguments:

* **`callback`** is an optional callback function, taking one argument:  
  * **`err`** is `null` if the history was cleared successfully, or an `Error` object if the history was not cleared successfully.

Example:

```js
playbyplay.clear();
```

Example with callback:

```js
playbyplay.clear(function(err) {
    if (err) {
        console.error('Clear failed:', err);
        return;
    }
    console.log('Clear succeeded');
});
```

# Contributing

Install dependencies:

```shell
$ npm install
```

Build `dist` directory:

```shell
$ npm run build
```

Run tests:

```shell
$ npm test
```

Automatically run tests after each change:

```shell
$ npm run watch
```
