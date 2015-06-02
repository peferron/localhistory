# playbyplay

LocalStorage history for language playgrounds.

Notes:
- Call `save(run)` just after the output is received. The user will be busy reading the output and won't notice if JS is blocked for a moment.
- `save(run)` is asynchronous to avoid delaying the rendering of the output.
- History is not an essential feature of a language playground. Playbyplay avoids throwing exceptions and logs errors to the console instead.
