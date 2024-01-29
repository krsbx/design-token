import {
  CollectionResultMap,
  ColorAlias,
  ColorAliasObject,
  ColorNonAlias,
  ColorNonAliasObject,
  ColorVariable,
  ModeResultMap,
  PluginResult,
} from '@/types/plugin';

export function extractColors(colorVariables: ColorVariable[]) {
  const colors = new Map<string, ColorNonAliasObject>();

  colorVariables
    .filter((value) => !value.isAlias)
    .forEach((variable) => {
      const value = variable as ColorNonAlias;
      const colorName = value.name.split('/').pop();

      if (!colorName) return;

      const colorNames = colorName.split('-');

      // If there is no color name, skip
      if (!colorNames.length) return;

      colors.set(value.name, {
        value: value.value,
        name: colorNames.slice(0, -1).join('-'),
        variant: colorNames.at(-1),
      });
    });

  return colors;
}

export function extractAliases(colorVariables: ColorVariable[]) {
  const aliases = new Map<string, ColorAliasObject>();

  colorVariables
    .filter((value) => value.isAlias)
    .forEach((variable) => {
      const value = variable as ColorAlias;
      const aliasName = value.value.name.split('/').pop();
      const colorName = value.name.split('/').pop();

      if (!aliasName || !colorName) return;

      const aliasNames = aliasName.split('-');
      const colorNames = colorName.split('-');

      // If there is no alias or color name, skip
      if (!aliasName.length || !colorNames.length) return;

      aliases.set(value.name, {
        value: {
          name: aliasNames.slice(0, -1).join('-'),
          variant: aliasNames.at(-1),
        },
        name: colorNames.slice(0, -1).join('-'),
        variant: colorNames.at(-1),
      });
    });

  return aliases;
}

export function getColorVariables(pluginResult: PluginResult) {
  const collections: CollectionResultMap = new Map();

  if (!pluginResult) return collections;

  pluginResult.collections.forEach((collection) => {
    const modes: ModeResultMap = new Map();

    collection.modes.forEach((mode) => {
      const extractedColor = extractColors(mode.variables);
      const extractedAliases = extractAliases(mode.variables);

      modes.set(mode.name, {
        colors: extractedColor,
        aliases: extractedAliases,
      });
    });

    collections.set(collection.name, modes);
  });

  return collections;
}
