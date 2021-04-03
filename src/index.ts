type QuandoResult<R> = R | undefined;
type QuandoParam<R> = (() => R) | QuandoResult<R>;

function extractResult<T>(result: QuandoParam<T>) {
  if (result instanceof Function) {
    return result();
  } else {
    return result;
  }
}

class Controller<R> {
  defaultCondition: Boolean;
  condition: Boolean;
  result: QuandoResult<R>;
  constructor(
    defaultCondition: Boolean,
    condition: Boolean,
    result: QuandoParam<R>,
  ) {
    this.defaultCondition = defaultCondition;
    this.condition = defaultCondition;
    this.updateResult(Boolean(condition), result);
  }
  end(defaultValue?: QuandoParam<R>) {
    if (this.condition === this.defaultCondition) {
      return this.result;
    }
    return extractResult<R>(defaultValue);
  }
  updateResult(condition: Boolean, result: QuandoParam<R>) {
    this.condition = condition;
    this.result = extractResult<R>(result);
  }
}

class WhenCondition<R> {
  private controller: Controller<R>;

  constructor(controller: Controller<R>) {
    this.controller = controller;
  }
  elseWhen(condition: Boolean, result: QuandoParam<R>) {
    this.controller.updateResult(condition, result);
    return this;
  }
  end(defaultValue?: QuandoParam<R>) {
    return this.controller.end(defaultValue);
  }
}

export function When<R>(condition: Boolean, result?: QuandoParam<R>) {
  return new WhenCondition<R>(new Controller<R>(true, condition, result));
}

class UnlessCondition<R> {
  private controller: Controller<R>;

  constructor(controller: Controller<R>) {
    this.controller = controller;
  }
  end(defaultValue?: QuandoParam<R>) {
    return this.controller.end(defaultValue);
  }
}

export function Unless<R>(condition: Boolean, result: QuandoParam<R>) {
  return new UnlessCondition<R>(new Controller<R>(false, condition, result));
}

class MatchCondition<M, R> {
  private matchable: M;
  private result: R | undefined;
  constructor(matchable: M) {
    this.matchable = matchable;
    this.result = undefined;
  }
  where(clause: M | ((arg: M) => Boolean), result: (() => R) | R | undefined) {
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
