import { StyleMap, TokenMap } from '@/types/plugin';
import { getTokenName } from './common';
import { appendStyle } from './styles';

export function generateCss(tokens: TokenMap) {
  const styleMap: StyleMap = new Map();

  tokens.forEach((token, label) => {
    const tokenName = getTokenName(label);

    if (!tokenName) return;

    const options = {
      tokenName: tokenName.replace(/ /g, '-').toLowerCase(),
      styleMap,
      token,
      label,
    };

    appendStyle(options);
  });

  const styles: string[] = [];

  styleMap.forEach((style, tokenName) => {
    const localStyle: string[] = [];

    localStyle.push(`.${tokenName} {`);
    style.forEach((value, key) => {
      localStyle.push(`  ${key}: ${value};`);
    });
    localStyle.push('}');

    styles.push(localStyle.join('\n'));
  });

  const css = styles.join('\n\n');

  return {
    styles: styleMap,
    css,
  };
}
