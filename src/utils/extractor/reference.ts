import { ReferenceMap, ReferenceVariable, Variable } from '@/types/plugin';
import { isWithVariant } from '../generator';

function fixUpReference(references: ReferenceMap) {
  references.forEach((reference) => {
    const isHasVariant = isWithVariant(references, reference, true);
    const name = [reference.name, reference.variant].filter(Boolean).join('-');

    if (!isHasVariant) return;

    references.delete(reference.name);
    references.set(name, {
      value: reference.value,
      name,
      variant: 'default',
    });
  });
}

export function extractReference(variables: Variable[]) {
  const references: ReferenceMap = new Map();

  variables
    .filter((value) => !value.isAlias)
    .forEach((variable) => {
      const value = variable as ReferenceVariable;
      const colorName = value.name.split('/').pop();

      if (!colorName) return;

      const colorNames = colorName.split('-');

      // If there is no color name, skip
      if (!colorNames.length) return;

      references.set(value.name, {
        value: value.value,
        name: colorNames.slice(0, -1).join('-'),
        variant: colorNames.at(-1) ?? null,
      });
    });

  fixUpReference(references);

  return references;
}
