import { TokenMap, TokensBrucke, Variable } from '@/types/plugin';
import { hasOwnProperty } from './common';

function fixupValue<T extends TokenMap>(tokens: T): T {
  tokens.forEach((token) => {
    if (token.value.startsWith('{') && token.value.endsWith('}')) {
      const valueKeyRef = token.value.slice(1, -1);
      const valueRef = tokens.get(valueKeyRef);

      if (!valueRef) return;

      // eslint-disable-next-line no-param-reassign
      token.value = valueRef.value;
    }
  });

  return tokens;
}

export function extractTokens(tokensBrucke: TokensBrucke): TokenMap {
  const tokens: TokenMap = new Map();

  Object.entries(tokensBrucke).forEach(([collectionName, collections]) => {
    if (collectionName.startsWith('$')) return;

    // Add handler for components
    if (collectionName.startsWith('[') && collectionName.endsWith(']')) {
      return;
    }

    Object.entries(collections).forEach(
      ([subcollectionName, subcollections]) => {
        const baseName = [collectionName, subcollectionName];

        if (hasOwnProperty<Variable['value']>(subcollections, 'value')) {
          const name = baseName.join('.');
          tokens.set(name, subcollections as Variable);
          return;
        }

        Object.entries(subcollections).forEach(([variableName, variables]) => {
          if (hasOwnProperty<Variable['value']>(variables, 'value')) {
            const name = [...baseName, variableName].join('.');
            tokens.set(name, variables as unknown as Variable);
            return;
          }

          Object.entries(variables).forEach(([key, value]) => {
            const name = [...baseName, variableName, key].join('.');
            tokens.set(name, value as unknown as Variable);
          });
        });
      }
    );
  });

  fixupValue(tokens);

  return tokens;
}
