import {
  WriteableConfig,
  ConfigSchema,
  PluginResult,
  StringRecord,
} from '@/types/plugin';
import fs from 'fs-extra';
import path from 'node:path';
import get from 'lodash.get';
import { getCollections } from './extractor';
import { createSchemas } from './generator';

function createWriteableConfig(schemas: ConfigSchema) {
  let config: WriteableConfig = {};

  schemas.forEach((schema, parentKey) => {
    const isString = typeof schema === 'string';

    if (isString) {
      config = {
        ...config,
        [parentKey]: get(config, schema) as string,
      };
      return;
    }

    Object.entries(schema).forEach(([childKey, childValue]) => {
      const isAlias = childValue.split('.').length > 1;
      const value = !isAlias ? childValue : (get(config, childValue) as string);

      config = {
        ...config,
        [parentKey]: {
          ...((config?.[parentKey] ?? {}) as StringRecord),
          [childKey]: value,
        },
      };
    });
  });

  return config;
}

export function writeConfig(json: PluginResult, writeLocation = './config') {
  const collections = getCollections(json.collections);

  // Create destination folder
  fs.ensureDirSync(writeLocation);

  collections.forEach((collection, collectionName) => {
    collection.forEach((mode, modeName) => {
      const fileName = [collectionName, modeName, 'ts'].join('.');
      const schemas = createSchemas(mode);
      const config = createWriteableConfig(schemas);

      fs.writeFileSync(
        path.join(writeLocation, fileName),
        `module.exports = ${JSON.stringify(config, null, 2)}`
      );
    });
  });
}
