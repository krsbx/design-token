import { StyleMap, Variable } from '@/types/plugin';

type Option = {
  label: string;
  tokenName: string;
  token: Variable;
  styleMap: StyleMap;
  logNotSupported?: boolean;
};

export function appendStyle(options: Option) {
  const { label, styleMap, token, tokenName, logNotSupported } = options;

  const style = styleMap.get(tokenName) || new Map();

  if (tokenName.startsWith('bg-') && token.type === 'color') {
    style.set('background-color', token.value);
    styleMap.set(tokenName, style);
    return;
  }

  if (tokenName.startsWith('text-') && token.type === 'color') {
    style.set('color', token.value);
    styleMap.set(tokenName, style);
    return;
  }

  if (
    (tokenName.startsWith('radius-') || tokenName === 'radius') &&
    token.type === 'dimension'
  ) {
    style.set('border-radius', token.value);
    styleMap.set(tokenName, style);
    return;
  }

  if (tokenName.startsWith('border-') && token.type === 'color') {
    style.set('border-color', token.value);
    styleMap.set(tokenName, style);
    return;
  }

  if (label.startsWith('Primitives') && token.type === 'color') {
    const props = {
      text: 'color',
      bg: 'background-color',
      border: 'border-color',
    };

    Object.entries(props).forEach(([prop, property]) => {
      const className = [prop, tokenName].join('-');
      style.set(property, token.value);
      styleMap.set(className, style);
    });
    return;
  }

  if (logNotSupported) {
    console.log(`Unsupported token: ${label} (${token.type})`);
  }
}
