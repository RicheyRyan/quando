type QuandoResult<R> = R | undefined;
type QuandoThunkable<R> = (() => QuandoResult<R>) | QuandoResult<R>;
type QuandoMatchable<M> = ((matchable: M) => Boolean) | M;
type QuandoMatcher<M, R> = (
  matchable: M,
  clause: QuandoMatchable<M>,
  result: QuandoThunkable<R>,
) => QuandoResult<R>;

export function extractResult<T>(result: QuandoThunkable<T>) {
  if (result instanceof Function) {
    return result();
  } else {
    return result;
  }
}

function compareBooleans<R>(
  comparable: boolean,
  clause: QuandoMatchable<boolean>,
  result: QuandoThunkable<R>,
) {
  if (comparable === Boolean(clause)) {
    return extractResult<R>(result);
  }
  return undefined;
}

export class Matcher<M, R> {
  matchable: M;
  checkCondition: QuandoMatcher<M, R>;
  result: QuandoResult<R>;
  constructor(checkCondition: QuandoMatcher<M, R>, matchable: M) {
    this.matchable = matchable;
    this.checkCondition = checkCondition;
  }
  end(defaultValue?: QuandoThunkable<R>) {
    if (this.result) {
      return this.result;
    }
    return extractResult<R>(defaultValue);
  }
  updateResult(clause: QuandoMatchable<M>, result: QuandoThunkable<R>) {
    if (!this.result) {
      this.result = this.checkCondition(this.matchable, clause, result);
    }
    return this;
  }
}

class WhenCondition<R> {
  private matcher: Matcher<boolean, R>;

  constructor(matcher: Matcher<boolean, R>) {
    this.matcher = matcher;
  }
  elseWhen(condition: boolean, result: QuandoThunkable<R>) {
    this.matcher.updateResult(condition, result);
    return this;
  }
  end(defaultValue?: QuandoThunkable<R>) {
    return this.matcher.end(defaultValue);
  }
}

export function When<R>(condition: boolean, result?: QuandoThunkable<R>) {
  return new WhenCondition<R>(
    new Matcher<boolean, R>(compareBooleans, true).updateResult(
      condition,
      result,
    ),
  );
}

class UnlessCondition<R> {
  private matcher: Matcher<boolean, R>;

  constructor(matcher: Matcher<boolean, R>) {
    this.matcher = matcher;
  }
  end(defaultValue?: QuandoThunkable<R>) {
    return this.matcher.end(defaultValue);
  }
}

export function Unless<R>(condition: boolean, result: QuandoThunkable<R>) {
  return new UnlessCondition<R>(
    new Matcher<boolean, R>(compareBooleans, false).updateResult(
      condition,
      result,
    ),
  );
}

function compareMatches<M, R>(
  matchable: M,
  clause: QuandoMatchable<M>,
  result: QuandoThunkable<R>,
) {
  if (
    (clause instanceof Function && clause(matchable)) ||
    matchable === clause
  ) {
    return extractResult<R>(result);
  }
  return undefined;
}

class MatchCondition<M, R> {
  private matcher: Matcher<M, R>;

  constructor(matcher: Matcher<M, R>) {
    this.matcher = matcher;
  }
  where(clause: QuandoMatchable<M>, result: QuandoThunkable<R>) {
    this.matcher.updateResult(clause, result);
    return this;
  }
  end(defaultValue?: QuandoThunkable<R>) {
    return this.matcher.end(defaultValue);
  }
}

export function Match<M, R>(matchable: M) {
  return new MatchCondition<M, R>(new Matcher<M, R>(compareMatches, matchable));
}
