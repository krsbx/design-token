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
import { EXTENSION, Extension } from './constant';

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

export function writeConfig(options: {
  json: PluginResult;
  writeLocation: string;
  extension: Extension;
}) {
  const { json, extension, writeLocation } = options;
  const collections = getCollections(json.collections);

  // Create destination folder
  fs.ensureDirSync(writeLocation);

  collections.forEach((collection, collectionName) => {
    collection.forEach((mode, modeName) => {
      const writePath = path.join(writeLocation, collectionName);

      fs.ensureDirSync(writePath);

      const fileName = [modeName, extension].join('.');
      const schemas = createSchemas(mode);
      const config = createWriteableConfig(schemas);
      const stringified = JSON.stringify(config, null, 2);

      let content: string;

      switch (extension) {
        case EXTENSION.TS:
          content = `export default ${stringified}`;
          break;

        case EXTENSION.JS:
        default:
          content = `module.exports = ${stringified}`;
          break;
      }

      fs.writeFileSync(path.join(writePath, fileName), content);
    });
  });
}
