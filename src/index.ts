type QuandoResult<R> = R | undefined;

interface QuandoConditonal<R> {
  result: QuandoResult<R>;
  condition: Boolean;
  elseWhen: (condition: Boolean, result: R) => QuandoConditonal<R>;
  end: (result: R) => QuandoResult<R>;
}

class WhenCondition<R> implements QuandoConditonal<R> {
  condition: Boolean;
  result: QuandoResult<R>;

  constructor(condition: Boolean, result: QuandoResult<R>) {
    this.condition = false;
    this.updateResult(condition, result);
  }
  elseWhen(condition: Boolean, result: QuandoResult<R>) {
    this.updateResult(condition, result);
    return this;
  }
  end(defaultValue: R) {
    if (this.condition) {
      return this.result;
    }
    return defaultValue;
  }

  updateResult(condition: Boolean, result: QuandoResult<R>) {
    if (!this.condition && condition) {
      this.condition = condition;
      this.result = result;
    }
  }
}

export function When<R>(condition: Boolean, result: QuandoResult<R>) {
  return new WhenCondition<R>(condition, result);
}
