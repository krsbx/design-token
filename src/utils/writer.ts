import { ColorConfig, PluginResult, StringRecord } from '@/types/plugin';
import fs from 'node:fs';
import get from 'lodash.get';
import { getColorVariables } from './extractor';
import { createSchemas } from './generator';

export function writeConfig(json: PluginResult, writeLocation = './config.ts') {
  const colorVariables = getColorVariables(json);
  const schemas = createSchemas(colorVariables);

  let config: ColorConfig = {};

  schemas.forEach((value, key) => {
    const parentKey = key;
    const isString = typeof value === 'string';

    if (isString) {
      config = {
        ...config,
        [key]: get(config, value) as string,
      };
      return;
    }

    Object.entries(value).forEach(([childKey, childValue]) => {
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

  fs.writeFileSync(
    writeLocation,
    `module.exports = ${JSON.stringify(config, null, 2)}`
  );

  return config;
}
