type QuandoResult<R> = R | undefined;
type QuandoParam<R> = R | (() => R) | undefined;

interface QuandoConditonal<R> {
  result: QuandoResult<R>;
  condition: Boolean;
  elseWhen: (condition: Boolean, result: R) => QuandoConditonal<R>;
  end: (result: R) => QuandoResult<R>;
}

class WhenCondition<R> implements QuandoConditonal<R> {
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
  end(defaultValue: QuandoParam<R>) {
    if (this.condition) {
      return this.result;
    }
    return this.extractResult(defaultValue);
  }

  updateResult(condition: Boolean, result: QuandoParam<R>) {
    if (!this.condition && condition) {
      this.condition = condition;
      this.result = this.extractResult(result);
    }
  }

  extractResult(result: QuandoParam<R>) {
    if (result instanceof Function) {
      return result();
    } else {
      return result;
    }
  }
}

export function When<R>(condition: Boolean, result: QuandoParam<R>) {
  return new WhenCondition<R>(condition, result);
}
