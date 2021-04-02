import tap from "tap";

import { When } from "../src/index";

tap.test("When the initial condition is true it returns that result", (t) => {
  t.equal(When<number>(true, 1).end(0), 1);
  t.equal(When<number>(true, () => 1).end(0), 1);
  t.end();
});

tap.test("When the initial condition is false it returns the default", (t) => {
  t.equal(When<number>(false, 1).end(0), 0);
  t.equal(
    When<number>(false, 1).end(() => 0),
    0
  );
  t.end();
});

tap.test(
  "When the initial condition is false and there is an else condition, it returns that",
  (t) => {
    t.equal(When<number>(false, 1).elseWhen(true, 99).end(0), 99);
    t.equal(
      When<number>(false, 1)
        .elseWhen(true, () => 99)
        .end(0),
      99
    );
    t.end();
  }
);

tap.test(
  "When the initial condition is false and there is an else condition but it is also false, it returns the default",
  (t) => {
    t.equal(When<number>(false, 1).elseWhen(false, 99).end(0), 0);
    t.equal(
      When<number>(false, 1)
        .elseWhen(false, 99)
        .end(() => 0),
      0
    );
    t.end();
  }
);
