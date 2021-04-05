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

JavaScript has poor support for conditional expressions, and handling scenarios with multiple clauses is impossible. It's awkward when handling conditions in JSX which encourages an expression oriented approach and doesn't provide conditional elements found in a templating language like Handlebars.

Some proposals would bring more powerful conditional expressions to JavaScript like [do](https://github.com/tc39/proposal-do-expressions) and [pattern matching](https://github.com/tc39/proposal-pattern-matching), but they are a long way off and may never happen. In an ideal world, this library would be made redundant by these proposals making it into the language. However, Quando is for the time we spend waiting.

Here's an example that handles the status of an API call using the `Match` function:

```ts
function Example() {
  const { status, error, data } = useQuery("repoData", () =>
    fetch("https://api.github.com/repos/richeyryan/quando").then(res =>
      res.json(),
    ),
  );

  return (
    <div>
      {Match(status)
        .where("error", () => <>"An error has occured: " {error.message}</>)
        .where("loading", "Loading...")
        .end(() => (
          <>
            <h1>{data.name}</h1>
            <p>{data.description}</p>
            <strong>👀 {data.subscribers_count}</strong>{" "}
            <strong>✨ {data.stargazers_count}</strong>{" "}
            <strong>🍴 {data.forks_count}</strong>
          </>
        ))}
    </div>
  );
}
```

## Functions

_Compatibility_

The API aims to avoid clashing with current or potential future JavaScript features. We avoid reserved words where possible, and `When` is capitalized to avoid conflicts with the pattern matching proposal.

_[Fluent Interface](https://en.wikipedia.org/wiki/Fluent_interface)_

Each function has a chainable API or fluent interface. You must complete the chain with the `end` method, which will return the result of your expression. You can also provide the default value with the end method if there are no matches in your condition.

_Lazy Evaluation_

The result parameter of any condition can be a function. If the condition is truthy, the function gets called, which prevents issues like in the example above where we get an error if we try to read `data.name` before it's defined.

### When

The equivalent of an if statement, returns the first clause where the condition is truthy. Returns the default if there is no match.

```js
import { When } from "quando";

When(status === "loading", <Loading />)
  .elseWhen(status === "error", <Error message="Failed to load user" />)
  .elseWhen(status === "success", <User user={user} />)
  .end();
```

### Unless

Returns the clause if the condition is falsy. Returns the default if the condition is truthy.

```js
import { Unless } from "quando";

Unless(user, "Select a user to continue");
```

### Match

A very rough approximation of pattern matching. Basically an expression version of a switch statement.

The first parameter of `where` can be a value that strictly matches (`===`) the comparable passed to `Match`. Otherwise, it can be a function which takes the comparable as a parameter and returns `true` if it matches or `false` if it doesn't.

The second parameter can be any value or a function that is called only when the comparable is matched.

```js
Match("John")
  .where("John", "guitar")
  .where("George", "guitar")
  .where("Paul", "bass")
  .where("Ringo", "drums")
  .end();
```

### Examples

Examples of using each function can be found in the `examples` folder. You can run them like this:

```sh
yarn build
node examples/examples.js
```

Any contributions of interesting examples would be much appreciated.

### Extending the library

Each of the functions above are factories that create an instance of a class. There is a class for each of the functions. Each class is a facade over the `Matcher` class, they make the public fluent interface and each call passes through to the `Matcher` which handles the actual matching logic.

You can import the `Matcher` class and the `extractResult` function which helps with results that are passed as functions. Using them both you can create your own factory function and inject your own matching logic into the `Matcher` class.
