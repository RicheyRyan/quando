import { When, Unless, Match } from "../src";

interface User {
  name: string;
}

describe("Quando", () => {
  describe("When", () => {
    it("returns the result when the initial condition is true", () => {
      expect(When<number>(true, 1).end(0)).toBe(1);
      expect(When<number>(true, () => 1).end(0)).toBe(1);
    });
    it("returns the default when the initial condition is false", () => {
      expect(When<number>(false, 1).end(0)).toBe(0);
      expect(When<number>(false, 1).end(() => 0)).toBe(0);
    });
    it("returns the elseWhen conditon when the initial condition is false", () => {
      expect(
        When<number>(false, 1)
          .elseWhen(true, 99)
          .end(0),
      ).toBe(99);
      expect(
        When<number>(false, 1)
          .elseWhen(true, () => 99)
          .end(0),
      ).toBe(99);
    });

    it("returns the default when the initial condition is false and there is an else condition but it is also false", () => {
      expect(
        When<number>(false, 1)
          .elseWhen(false, 99)
          .end(0),
      ).toBe(0);
      expect(
        When<number>(false, 1)
          .elseWhen(false, 99)
          .end(() => 0),
      ).toBe(0);
    });

    it("returns undefined when the initial condition is false and there is an else condition but it is also false and the default is not supplied", () => {
      expect(
        When<number>(false, 1)
          .elseWhen(false, 99)
          .end(),
      ).toBeUndefined();
    });
  });
  describe("Unless", () => {
    it("returns the result when the initial condition is false", () => {
      expect(Unless<number>(false, 1).end()).toBe(1);
      expect(Unless<number>(false, () => 1).end()).toBe(1);
    });
    it("returns the default when the initial condition is true", () => {
      expect(Unless<number>(true, 1).end(0)).toBe(0);
      expect(Unless<number>(true, () => 1).end(() => 0)).toBe(0);
    });
  });
  describe("Match", () => {
    it("matches against a primitve", () => {
      expect(
        Match<string, string>("test")
          .where("foo", "foo")
          .where("bar", "bar")
          .where("test", "test")
          .end(),
      ).toBe("test");
      expect(
        Match<string, string>("test")
          .where("foo", () => "foo")
          .where("bar", () => "bar")
          .where("test", () => "test")
          .end(),
      ).toBe("test");
    });
    it("matches against an object using a match function", () => {
      expect(
        Match<User, string>({ name: "John" })
          .where((user: User) => user.name === "John", "John")
          .where((user: User) => user.name === "George", "George")
          .where((user: User) => user.name === "Paul", "Paul")
          .where((user: User) => user.name === "Ringo", "Ringo")
          .end(),
      ).toBe("John");
      expect(
        Match<User, string>({ name: "John" })
          .where(
            (user: User) => user.name === "John",
            () => "John",
          )
          .where(
            (user: User) => user.name === "George",
            () => "George",
          )
          .where(
            (user: User) => user.name === "Paul",
            () => "Paul",
          )
          .where(
            (user: User) => user.name === "Ringo",
            () => "Ringo",
          )
          .end(),
      ).toBe("John");
    });
    it("returns the default value if there is no match", () => {
      expect(
        Match<User, string>({ name: "Pete" })
          .where((user: User) => user.name === "John", "John")
          .where((user: User) => user.name === "George", "George")
          .where((user: User) => user.name === "Paul", "Paul")
          .where((user: User) => user.name === "Ringo", "Ringo")
          .end("Billy"),
      ).toBe("Billy");
      expect(
        Match<User, string>({ name: "Pete" })
          .where(
            (user: User) => user.name === "John",
            () => "John",
          )
          .where(
            (user: User) => user.name === "George",
            () => "George",
          )
          .where(
            (user: User) => user.name === "Paul",
            () => "Paul",
          )
          .where(
            (user: User) => user.name === "Ringo",
            () => "Ringo",
          )
          .end(() => "Billy"),
      ).toBe("Billy");
    });
    it("returns the earliest matching clause", () => {
      expect(
        Match<boolean, number>(true)
          .where(false, 0)
          .where(false, 1)
          .where(true, 2)
          .where(true, 3)
          .where(false, 4)
          .end(),
      ).toBe(2);
    });
  });
});
