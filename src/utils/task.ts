type Callback = () => void;

export class Task {
  private promise: Promise<void> = Promise.resolve();

  private resolveCb: Callback | null = null;

  private active = false;

  public readyPromise() {
    return this.promise;
  }

  public isActive(): boolean {
    return this.active;
  }

  public create() {
    if (this.active) {
      throw new Error("Task is active");
    }
    this.active = true;

    this.promise = new Promise((resolve) => {
      this.resolveCb = resolve;
    });
  }

  public resolve() {
    this.active = false;

    if (this.resolveCb !== null) {
      this.resolveCb();
      this.resolveCb = null;
    }
  }
}
