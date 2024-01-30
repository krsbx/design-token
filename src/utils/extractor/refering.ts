import { ReferingMap, ReferingVariable, Variable } from '@/types/plugin';
import { isWithVariant } from '../generator';

function fixUpRefering(referings: ReferingMap) {
  referings.forEach((refering) => {
    const isHasVariant = isWithVariant(referings, refering, true);
    const name = [refering.name, refering.variant].filter(Boolean).join('-');

    if (!isHasVariant) return;

    referings.delete(refering.name);
    referings.set(name, {
      value: {
        name: refering.value.name,
        variant: null,
      },
      name,
      variant: 'default',
    });
  });
}

export function extractRefering(variables: Variable[]) {
  const referings: ReferingMap = new Map();

  variables
    .filter((value) => value.isAlias)
    .forEach((variable) => {
      const value = variable as ReferingVariable;
      const aliasName = value.value.name.split('/').pop();
      const colorName = value.name.split('/').pop();

      if (!aliasName || !colorName) return;

      const aliasNames = aliasName.split('-');
      const colorNames = colorName.split('-');

      // If there is no alias or color name, skip
      if (!aliasName.length || !colorNames.length) return;

      referings.set(value.name, {
        value: {
          name: aliasNames.slice(0, -1).join('-'),
          variant: aliasNames.at(-1) ?? null,
        },
        name: colorNames.slice(0, -1).join('-'),
        variant: colorNames.at(-1) ?? null,
      });
    });

  fixUpRefering(referings);

  return referings;
}
