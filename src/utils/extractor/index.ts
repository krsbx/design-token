import {
  CollectionResultMap,
  ModeResultMap,
  PluginCollection,
  PluginMode,
  PluginResult,
  Variable,
} from '@/types/plugin';
import { extractReference } from './reference';
import { extractRefering } from './refering';

export function getVariables(variables: Variable[]) {
  const references = extractReference(variables);
  const referings = extractRefering(variables);

  return {
    references,
    referings,
  };
}

export function getModeVariables(pluginMode: PluginMode) {
  const variables = getVariables(pluginMode.variables);

  return {
    name: pluginMode.name,
    variables,
  };
}

export function getCollections(pluginCollections: PluginCollection[]) {
  const collections: CollectionResultMap = new Map();

  pluginCollections.forEach((collection) => {
    const modes: ModeResultMap = new Map();

    collection.modes.forEach((mode) => {
      const { name, variables } = getModeVariables(mode);

      modes.set(name, variables);
    });

    collections.set(collection.name, modes);
  });

  return collections;
}

export function getColorVariables(pluginResult: PluginResult) {
  const collections: CollectionResultMap = new Map();

  if (!pluginResult) return collections;

  pluginResult.collections.forEach((collection) => {
    const modes: ModeResultMap = new Map();

    collection.modes.forEach((mode) => {
      const { references, referings } = getVariables(mode.variables);

      modes.set(mode.name, {
        references,
        referings,
      });
    });

    collections.set(collection.name, modes);
  });

  return collections;
}
