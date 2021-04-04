type QuandoResult<R> = R | undefined;
type QuandoParam<R> = (() => R) | QuandoResult<R>;
type QuandoMatches<M> = M | ((arg: M) => Boolean) | Boolean;
type QuandoComparer<M, R> = (
  comparable: M,
  clause: QuandoMatches<M>,
  result: QuandoParam<R>,
) => QuandoResult<R>;

function extractResult<T>(result: QuandoParam<T>) {
  if (result instanceof Function) {
    return result();
  } else {
    return result;
  }
}

function compareBooleans<R>(
  comparable: boolean,
  clause: QuandoMatches<boolean>,
  result: QuandoParam<R>,
) {
  if (comparable === Boolean(clause)) {
    return extractResult<R>(result);
  }
  return undefined;
}

class Matcher<M, R> {
  matchable: M;
  checkCondition: QuandoComparer<M, R>;
  result: QuandoResult<R>;
  constructor(checkCondition: QuandoComparer<M, R>, matchable: M) {
    this.matchable = matchable;
    this.checkCondition = checkCondition;
  }
  end(defaultValue?: QuandoParam<R>) {
    if (this.result) {
      return this.result;
    }
    return extractResult<R>(defaultValue);
  }
  updateResult(clause: QuandoMatches<M>, result: QuandoParam<R>) {
    if (this.result) return;
    this.result = this.checkCondition(this.matchable, clause, result);
  }
}

class WhenCondition<M, R> {
  private matcher: Matcher<M, R>;

  constructor(matcher: Matcher<M, R>) {
    this.matcher = matcher;
  }
  elseWhen(condition: M, result: QuandoParam<R>) {
    this.matcher.updateResult(condition, result);
    return this;
  }
  end(defaultValue?: QuandoParam<R>) {
    return this.matcher.end(defaultValue);
  }
}

export function When<R>(condition: boolean, result?: QuandoParam<R>) {
  const matcher = new Matcher<boolean, R>(compareBooleans, true);
  matcher.updateResult(condition, result);
  return new WhenCondition<boolean, R>(matcher);
}

class UnlessCondition<M, R> {
  private matcher: Matcher<M, R>;

  constructor(matcher: Matcher<M, R>) {
    this.matcher = matcher;
  }
  end(defaultValue?: QuandoParam<R>) {
    return this.matcher.end(defaultValue);
  }
}

export function Unless<R>(condition: boolean, result: QuandoParam<R>) {
  const matcher = new Matcher<boolean, R>(compareBooleans, false);
  matcher.updateResult(condition, result);
  return new UnlessCondition<boolean, R>(matcher);
}

function compareMatches<M, R>(
  comparable: M,
  clause: QuandoMatches<M>,
  result: QuandoParam<R>,
) {
  if (clause instanceof Function && clause(comparable)) {
    return extractResult<R>(result);
  } else if (comparable === clause) {
    return extractResult<R>(result);
  }
  return undefined;
}

class MatchCondition<M, R> {
  private matcher: Matcher<M, R>;

  constructor(matcher: Matcher<M, R>) {
    this.matcher = matcher;
  }
  where(clause: QuandoMatches<M>, result: QuandoParam<R>) {
    this.matcher.updateResult(clause, result);
    return this;
  }
  end(defaultValue?: QuandoParam<R>) {
    return this.matcher.end(defaultValue);
  }
}

export function Match<M, R>(matchable: M) {
  return new MatchCondition<M, R>(new Matcher<M, R>(compareMatches, matchable));
}
