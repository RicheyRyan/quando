type QuandoResult<R> = R | undefined;
type QuandoParam<R> = R | (() => R) | undefined;

interface QuandoConditonal<R> {
  result: QuandoResult<R>;
  condition: Boolean;
  end: (result: R) => QuandoResult<R>;
}
interface WhenConditonal<R> extends QuandoConditonal<R> {
  elseWhen: (condition: Boolean, result: R) => QuandoConditonal<R>;
}

class WhenCondition<R> implements WhenConditonal<R> {
  condition: Boolean;
  result: QuandoResult<R>;

  constructor(condition: Boolean, result: QuandoParam<R>) {
    this.condition = false;
    this.updateResult(condition, result);
  }
  elseWhen(condition: Boolean, result: QuandoParam<R>) {
    this.updateResult(condition, result);
    return this;
  }
  end(defaultValue?: QuandoParam<R>) {
    if (this.condition) {
      return this.result;
    }
    return this.extractResult(defaultValue);
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

export function When<R>(condition: Boolean, result?: QuandoParam<R>) {
  return new WhenCondition<R>(condition, result);
}

class UnlessCondition<R> implements QuandoConditonal<R> {
  condition: Boolean;
  result: QuandoResult<R>;

  constructor(condition: Boolean, result: QuandoParam<R>) {
    this.condition = true;
    this.updateResult(condition, result);
  }
  end(defaultValue?: QuandoParam<R>) {
    if (this.condition === false) {
      return this.result;
    }
    return this.extractResult(defaultValue);
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

export function Unless<R>(condition: Boolean, result: QuandoParam<R>) {
  return new UnlessCondition<R>(condition, result);
}
