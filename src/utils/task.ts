type Callback = () => void;

export class Task {
  public readonly readyPromise: Promise<void>;

  private resolveCb: Callback | null = null;

  public constructor() {
    this.readyPromise = new Promise((resolve) => {
      this.resolveCb = resolve;
    });
  }

  public resolve() {
    if (this.resolveCb !== null) {
      this.resolveCb();
      this.resolveCb = null;
    }
  }
}
