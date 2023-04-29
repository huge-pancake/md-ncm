# Contributing

## Code Styles

### Tools

To keep our code clean, always run `pnpm lint` and `pnpm prettier` before you contribute.

### Details

_\* Follow [`.prettierrc`](./.prettierrc) first._

#### (File) Filename

Whatever the file includes, its name should be lowercased and the words in it should be divided by `-`.

#### (JS/TS) Arrow Functions

- Use `function` in the global scope and for `Object.prototype` properties.
- Use `class` for object constructors.
- Use `=>` everywhere else.

_\*See [https://stackoverflow.com/questions/22939130/when-should-i-use-arrow-functions-in-ecmascript-6](https://stackoverflow.com/questions/22939130/when-should-i-use-arrow-functions-in-ecmascript-6)_
