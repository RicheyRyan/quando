# Quando

![npm bundle size](https://img.shields.io/bundlephobia/minzip/quando?style=flat-square)
![GitHub](https://img.shields.io/github/license/richeyryan/quando?style=flat-square)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/RicheyRyan/quando.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/RicheyRyan/quando/context:javascript)

🎵 _Tell me when will you be mine? / Tell me quando quando quando_ 🎵

## Install

```sh
npm i quando
```

```sh
yarn add quando
```

## Motivation

JavaScript has poor support for conditional expressions, and handling scenarios with more than three clauses is impossible. It's particularly painful when handling conditions in JSX which encourages using inline expressions and doesn't provide conditional elements that can be found in a templating language like Handlebars.

There are proposals that would bring more powerful conditional expressions to Javascript like [do](https://github.com/tc39/proposal-do-expressions) and [pattern matching](https://github.com/tc39/proposal-pattern-matching), but they are a long way off and may never happen.

In an ideal world, this library would be made redundant by the language updates.

## Functions

The functions below have been named to avoid clashing with current or potential future JavaScript features.

Each function is chainable in a [fluent](https://en.wikipedia.org/wiki/Fluent_interface) API. You must complete the chain with the `end` method, otherwise it won't know to return the result of your expression. The end method can also be used to provide the default value if there are no matches in your condition like the `default` clause of a switch statement.

### When

The equivalent of an if statement.

```js
import { When } from "quando";

When(status === "loading", <Loading />)
  .elseWhen(status === "error", <Error message="Failed to load user" />)
  .elseWhen(status === "success", <User user={user} />)
  .end();
```

### Unless

The equivalent of an early return or something like `!user &&`

```js
import { Unless } from "quando";

Unless(user, "Select a user to continue");
```

### Match

A very rough approximation of pattern matching. Basically an expression version of a switch statement.

```js
Match("John")
  .where("John", "guitar")
  .where("George", "guitar")
  .where("Paul", "bass")
  .where("Ringo", "drums")
  .end();
```
