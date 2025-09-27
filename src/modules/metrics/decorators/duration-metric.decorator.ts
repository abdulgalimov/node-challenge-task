import { Histogram } from "prom-client";

type Options = {
  name: string;
  help: string;
};

export function DurationMetric(options: Options) {
  const { name, help } = options;

  return function (
    _target: any,
    _propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value as (
      ...args: unknown[]
    ) => Promise<unknown> | unknown;

    const histogram = new Histogram({
      name: `${name}_duration_seconds`,
      help,
      buckets: [0.05, 0.1, 0.3, 0.5, 1, 2, 5],
    });

    descriptor.value = async function (...args: unknown[]) {
      const end = histogram.startTimer();

      const result = await originalMethod.apply(this, args);

      end();

      return result;
    };

    return descriptor;
  };
}
