export type BaseVariable = {
  name: string;
  type: string;
};

export type ReferenceVariable = BaseVariable & {
  isAlias: false;
  value: string;
};

export type ReferingVariable = BaseVariable & {
  isAlias: true;
  value: {
    collection: string;
    name: string;
  };
};

export type Variable = ReferenceVariable | ReferingVariable;

export type ReferenceObject = {
  value: string;
  name: string;
  variant: string | null;
};

export type ReferingObject = {
  value: {
    name: string;
    variant: string | null;
  };
  name: string;
  variant: string | null;
};

export type PluginMode = {
  name: string;
  variables: Variable[];
};

export type PluginCollection = {
  name: string;
  modes: PluginMode[];
};

export type PluginResult = {
  version: `${number}.${number}.${number}`;
  metadata: NonNullable<unknown>;
  collections: PluginCollection[];
};

export type ReferenceMap = Map<string, ReferenceObject>;

export type ReferingMap = Map<string, ReferingObject>;

export type ModeResultMap = Map<
  string,
  {
    references: ReferenceMap;
    referings: ReferingMap;
  }
>;

export type CollectionResultMap = Map<string, ModeResultMap>;

export type StringRecord = Record<string, string>;

export type ConfigSchema = Map<string, string | StringRecord>;

export type WriteableConfig = Record<string, string | StringRecord>;
