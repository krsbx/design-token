import {
  ReferenceMap,
  ReferenceObject,
  ReferingMap,
  ReferingObject,
  ConfigSchema,
  StringRecord,
} from '@/types/plugin';

export function isWithVariant(
  references: ReferenceMap | ReferingMap,
  reference: ReferenceObject | ReferingObject,
  useVariant = false
) {
  const isHasVariant =
    [...references.values()].filter((value) => {
      if (!useVariant) return value.name.startsWith(reference.name);

      const name = [reference.name, reference.variant]
        .filter(Boolean)
        .join('-');

      return value.name.startsWith(name);
    }).length > 1;

  return isHasVariant;
}

export function createReferenceSchema(
  references: ReferenceMap,
  results: ConfigSchema
) {
  references.forEach((reference) => {
    const isHasVariant = isWithVariant(references, reference);
    const name = [reference.name, reference.variant].filter(Boolean).join('-');
    const result = results.get(reference.name);

    if (!isHasVariant) {
      results.set(name, reference.value);
      return;
    }

    if (!result) {
      results.set(reference.name, {});
    }

    if (results.get(reference.name) && reference.variant) {
      results.set(reference.name, {
        ...(results.get(reference.name) as StringRecord),
        [reference.variant]: reference.value,
      });
      return;
    }

    results.set(reference.name, reference.value);
  });
}

export function createReferingSchema(
  referings: ReferingMap,
  results: ConfigSchema
) {
  referings.forEach((refering) => {
    const isHasVariant = isWithVariant(referings, refering);
    const name = [refering.name, refering.variant].filter(Boolean).join('-');
    const value = [refering.value.name, refering.value.variant]
      .filter(Boolean)
      .join('.');
    const result = results.get(refering.name);

    if (!isHasVariant) {
      results.set(name, value);
      return;
    }

    if (!result) {
      results.set(refering.name, {});
    }

    if (results.get(refering.name) && refering.variant) {
      results.set(refering.name, {
        ...(results.get(refering.name) as StringRecord),
        [refering.variant]: value,
      });
      return;
    }

    results.set(refering.name, value);
  });
}

export function createSchemas(payload: {
  references: ReferenceMap;
  referings: ReferingMap;
}) {
  const { references, referings } = payload;

  const schemas: ConfigSchema = new Map();

  createReferenceSchema(references, schemas);
  createReferingSchema(referings, schemas);

  return schemas;
}
