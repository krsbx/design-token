import {
  CollectionResultMap,
  ColorAliasMap,
  ColorAliasObject,
  ColorNonAliasMap,
  ColorNonAliasObject,
  ColorSchema,
  StringRecord,
} from '@/types/plugin';

export function isWithVariant(
  colors: ColorAliasMap | ColorNonAliasMap,
  color: ColorAliasObject | ColorNonAliasObject,
  useVariant = false
) {
  const isHasVariant =
    [...colors.values()].filter((value) => {
      if (!useVariant) return value.name.startsWith(color.name);

      const name = [color.name, color.variant].filter(Boolean).join('-');

      return value.name.startsWith(name);
    }).length > 1;

  return isHasVariant;
}

export function createColorSchemas(
  colors: ColorNonAliasMap,
  results: ColorSchema
) {
  colors.forEach((color) => {
    const isHasVariant = isWithVariant(colors, color);
    const name = [color.name, color.variant].filter(Boolean).join('-');
    const result = results.get(color.name);

    if (!isHasVariant) {
      results.set(name, color.value);
      return;
    }

    if (!result) {
      results.set(color.name, {});
    }

    if (results.get(color.name) && color.variant) {
      results.set(color.name, {
        ...(results.get(color.name) as StringRecord),
        [color.variant]: color.value,
      });
      return;
    }

    results.set(color.name, color.value);
  });
}

export function createAliasSchemas(
  aliases: ColorAliasMap,
  results: ColorSchema
) {
  aliases.forEach((alias) => {
    const isHasVariant = isWithVariant(aliases, alias);
    const name = [alias.name, alias.variant].filter(Boolean).join('-');
    const value = [alias.value.name, alias.value.variant]
      .filter(Boolean)
      .join('.');
    const result = results.get(alias.name);

    if (!isHasVariant) {
      results.set(name, value);
      return;
    }

    if (!result) {
      results.set(alias.name, {});
    }

    if (results.get(alias.name) && alias.variant) {
      results.set(alias.name, {
        ...(results.get(alias.name) as StringRecord),
        [alias.variant]: value,
      });
      return;
    }

    results.set(alias.name, value);
  });
}

export function createSchemas(collections: CollectionResultMap) {
  const results: ColorSchema = new Map();

  collections.forEach((collection) => {
    collection.forEach(({ aliases, colors }) => {
      createColorSchemas(colors, results);
      createAliasSchemas(aliases, results);
    });
  });

  return results;
}
