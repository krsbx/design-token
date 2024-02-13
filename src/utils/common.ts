export function hasOwnProperty<
  Z extends NonNullable<unknown>,
  X extends NonNullable<unknown> = NonNullable<unknown>,
  Y extends PropertyKey = PropertyKey,
>(obj: X, key: Y): obj is X & Record<Y, Z> {
  return Object.hasOwn(obj, key);
}
