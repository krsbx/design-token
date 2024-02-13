import { DesignToken, Variable } from '@/types/plugin';

type AppendStyleOption = {
  key: string;
  tokenName: string;
  token: Variable;
  styles: string[];
};

function createStyle(key: string, property: string, value: string) {
  return `.${key} {
  ${property}: ${value};
}`;
}

function appendStyle(options: AppendStyleOption) {
  const { key, styles, token, tokenName } = options;

  if (tokenName.startsWith('bg-') && token.type === 'color') {
    styles.push(createStyle(tokenName, 'background-color', token.value));
    return;
  }

  if (tokenName.startsWith('text-') && token.type === 'color') {
    styles.push(createStyle(tokenName, 'color', token.value));
    return;
  }

  if (
    (tokenName.startsWith('radius-') || tokenName === 'radius') &&
    token.type === 'dimension'
  ) {
    styles.push(createStyle(tokenName, 'border-radius', token.value));
    return;
  }

  if (tokenName.startsWith('border-') && token.type === 'color') {
    styles.push(createStyle(tokenName, 'border-color', token.value));
    return;
  }

  if (key.startsWith('Primitives') && token.type === 'color') {
    const props = {
      text: 'color',
      bg: 'background-color',
      border: 'border-color',
    };

    Object.entries(props).forEach(([prop, property]) => {
      styles.push(createStyle(`${prop}-${tokenName}`, property, token.value));
    });
    return;
  }

  console.log(`Unsupported token: ${key} (${token.type})`);
}

export function generateCss(tokens: DesignToken) {
  const styles: string[] = [];

  Object.entries(tokens).forEach(([key, token]) => {
    const tokenNames = key.split('.');
    const isHasVariant = tokenNames.length === 4;

    const options = {
      styles,
      token,
      key,
    };

    if (isHasVariant) {
      const name = tokenNames.at(-2);
      const variant = tokenNames.at(-1);

      const tokenName = [name, variant].filter(Boolean).join('-');

      if (!tokenName) return;

      // Change the token name to the one with variant
      appendStyle({
        ...options,
        tokenName,
      });
      return;
    }

    const tokenName = tokenNames.at(-1);

    if (!tokenName) return;

    // Change the token name to the correct one
    appendStyle({
      ...options,
      tokenName,
    });
  });

  return styles.join('\n\n');
}
