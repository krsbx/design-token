export function hasOwnProperty<
  Z extends NonNullable<unknown>,
  X extends NonNullable<unknown> = NonNullable<unknown>,
  Y extends PropertyKey = PropertyKey,
>(obj: X, key: Y): obj is X & Record<Y, Z> {
  return Object.hasOwn(obj, key);
}

export function getTokenName(label: string) {
  const labels = label.split('.');
  const isHasVariant = labels.length === 4;

  if (isHasVariant) {
    const name = labels.at(-2);
    const variant = labels.at(-1);

    const tokenName = [name, variant].filter(Boolean).join('-');

    return tokenName || null;
  }

  const tokenName = labels.at(-1);

  return tokenName || null;
}
