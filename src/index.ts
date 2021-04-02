type QuandoResult<R> = R | undefined;
type QuandoParam<R> = R | (() => R) | undefined;
class Controller<R> {
  defaultCondition: Boolean;
  condition: Boolean;
  result: QuandoResult<R>;
  constructor(
    defaultCondition: Boolean,
    condition: Boolean,
    result: QuandoParam<R>
  ) {
    this.defaultCondition = defaultCondition;
    this.condition = defaultCondition;
    this.updateResult(Boolean(condition), result);
  }
  updateResult(condition: Boolean, result: QuandoParam<R>) {
    this.condition = condition;
    this.result = this.extractResult(result);
  }

  extractResult(result: QuandoParam<R>) {
    if (result instanceof Function) {
      return result();
    } else {
      return result;
    }
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
    if (this.controller.condition) {
      return this.controller.result;
    }
    return this.controller.extractResult(defaultValue);
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
    if (this.controller.condition === false) {
      return this.controller.result;
    }
    return this.controller.extractResult(defaultValue);
  }
}

export function Unless<R>(condition: Boolean, result: QuandoParam<R>) {
  return new UnlessCondition<R>(new Controller<R>(false, condition, result));
}
