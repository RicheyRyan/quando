type QuandoResult<R> = R | undefined;
type QuandoParam<R> = (() => R) | QuandoResult<R>;
type QuandoComparer<M, R> = (
  comparable: M,
  condition: M,
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
  comparable: Boolean,
  condition: Boolean,
  result: QuandoParam<R>,
) {
  if (comparable === Boolean(condition)) {
    return extractResult<R>(result);
  }
  return undefined;
}

class Controller<M, R> {
  comparable: M;
  checkCondition: QuandoComparer<M, R>;
  result: QuandoResult<R>;
  constructor(
    comparable: M,
    condition: M,
    result: QuandoParam<R>,
    checkCondition: QuandoComparer<M, R>,
  ) {
    this.comparable = comparable;
    this.checkCondition = checkCondition;
    this.updateResult(condition, result);
  }
  end(defaultValue?: QuandoParam<R>) {
    if (this.result) {
      return this.result;
    }
    return extractResult<R>(defaultValue);
  }
  updateResult(condition: M, result: QuandoParam<R>) {
    if (this.result) return;
    this.result = this.checkCondition(this.comparable, condition, result);
  }
}

class WhenCondition<M, R> {
  private controller: Controller<M, R>;

  constructor(controller: Controller<M, R>) {
    this.controller = controller;
  }
  elseWhen(condition: M, result: QuandoParam<R>) {
    this.controller.updateResult(condition, result);
    return this;
  }
  end(defaultValue?: QuandoParam<R>) {
    return this.controller.end(defaultValue);
  }
}

export function When<R>(condition: boolean, result?: QuandoParam<R>) {
  return new WhenCondition<boolean, R>(
    new Controller<boolean, R>(true, condition, result, compareBooleans),
  );
}

class UnlessCondition<M, R> {
  private controller: Controller<M, R>;

  constructor(controller: Controller<M, R>) {
    this.controller = controller;
  }
  end(defaultValue?: QuandoParam<R>) {
    return this.controller.end(defaultValue);
  }
}

export function Unless<R>(condition: boolean, result: QuandoParam<R>) {
  return new UnlessCondition<boolean, R>(
    new Controller<boolean, R>(false, condition, result, compareBooleans),
  );
}

class MatchCondition<M, R> {
  private matchable: M;
  private result: R | undefined;
  constructor(matchable: M) {
    this.matchable = matchable;
    this.result = undefined;
  }
  where(clause: M | ((arg: M) => Boolean), result: (() => R) | R | undefined) {
    if (this.result) return this;
    if (clause instanceof Function) {
      if (clause(this.matchable)) {
        this.result = extractResult<R>(result);
      }
    } else {
      if (this.matchable === clause) {
        this.result = extractResult<R>(result);
      }
    }
    return this;
  }
  end(defaultValue?: (() => R) | R | undefined) {
    if (this.result) {
      return this.result;
    }
    return extractResult<R>(defaultValue);
  }
}

export function Match<M, R>(matchable: M) {
  return new MatchCondition<M, R>(matchable);
}
