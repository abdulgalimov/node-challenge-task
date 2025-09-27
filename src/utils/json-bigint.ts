export function JSONBigIntStringify(
  value: unknown,
  space?: string | number
): string {
  return JSON.stringify(
    value,
    (_key, value: unknown) =>
      typeof value === "bigint"
        ? {
            type: "bigint",
            value: value.toString(),
          }
        : value,
    space
  );
}
