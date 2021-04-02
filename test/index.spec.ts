import tap from "tap";

import { When, Unless, Match } from "../src/index";

interface User {
  name: string;
}

tap.test("When", (t) => {
  tap.test("When the initial condition is true it returns that result", (t) => {
    t.equal(When<number>(true, 1).end(0), 1);
    t.equal(When<number>(true, () => 1).end(0), 1);
    t.end();
  });

  tap.test(
    "When the initial condition is false it returns the default",
    (t) => {
      t.equal(When<number>(false, 1).end(0), 0);
      t.equal(
        When<number>(false, 1).end(() => 0),
        0
      );
      t.end();
    }
  );

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

  tap.test(
    "When the initial condition is false and there is an else condition but it is also false and the default is not supplied, it returns undefined",
    (t) => {
      t.equal(When<number>(false, 1).elseWhen(false, 99).end(), undefined);
      t.end();
    }
  );

  t.end();
});

tap.test("Unless", (t) => {
  tap.test(
    "When the initial condition is false, it returns that result",
    (t) => {
      t.equal(Unless<number>(false, 1).end(), 1);
      t.equal(Unless<number>(false, () => 1).end(), 1);
      t.end();
    }
  );
  tap.test(
    "When the initial condition is true, it returns the default",
    (t) => {
      t.equal(Unless<number>(true, 1).end(0), 0);
      t.equal(
        Unless<number>(true, () => 1).end(() => 0),
        0
      );
      t.end();
    }
  );
  t.end();
});

tap.test("Match", (t) => {
  tap.test("It matches against a primitve", (t) => {
    t.equal(
      Match<string, string>("test")
        .where("foo", "foo")
        .where("bar", "bar")
        .where("test", "test")
        .end(),
      "test"
    );
    t.equal(
      Match<string, string>("test")
        .where("foo", () => "foo")
        .where("bar", () => "bar")
        .where("test", () => "test")
        .end(),
      "test"
    );
    t.end();
  });
  tap.test("It matches against an object using a match function", (t) => {
    t.equal(
      Match<User, string>({ name: "John" })
        .where((user: User) => user.name === "John", "John")
        .where((user: User) => user.name === "George", "George")
        .where((user: User) => user.name === "Paul", "Paul")
        .where((user: User) => user.name === "Ringo", "Ringo")
        .end(),
      "John"
    );
    t.equal(
      Match<User, string>({ name: "John" })
        .where(
          (user: User) => user.name === "John",
          () => "John"
        )
        .where(
          (user: User) => user.name === "George",
          () => "George"
        )
        .where(
          (user: User) => user.name === "Paul",
          () => "Paul"
        )
        .where(
          (user: User) => user.name === "Ringo",
          () => "Ringo"
        )
        .end(),
      "John"
    );
    t.end();
  });

  tap.test("It returns the default value if there is no match", (t) => {
    t.equal(
      Match<User, string>({ name: "Pete" })
        .where((user: User) => user.name === "John", "John")
        .where((user: User) => user.name === "George", "George")
        .where((user: User) => user.name === "Paul", "Paul")
        .where((user: User) => user.name === "Ringo", "Ringo")
        .end("Billy"),
      "Billy"
    );
    t.equal(
      Match<User, string>({ name: "Pete" })
        .where(
          (user: User) => user.name === "John",
          () => "John"
        )
        .where(
          (user: User) => user.name === "George",
          () => "George"
        )
        .where(
          (user: User) => user.name === "Paul",
          () => "Paul"
        )
        .where(
          (user: User) => user.name === "Ringo",
          () => "Ringo"
        )
        .end(() => "Billy"),
      "Billy"
    );
    t.end();
  });
  t.end();
});
