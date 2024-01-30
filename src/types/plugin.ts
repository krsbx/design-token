export type BaseColorVariable = {
  name: string;
  type: string;
};

export type ColorNonAlias = BaseColorVariable & {
  isAlias: false;
  value: string;
};

export type ColorAlias = BaseColorVariable & {
  isAlias: true;
  value: {
    collection: string;
    name: string;
  };
};

export type ColorVariable = ColorNonAlias | ColorAlias;

export type ColorNonAliasObject = {
  value: string;
  name: string;
  variant: string | null;
};

export type ColorAliasObject = {
  value: {
    name: string;
    variant: string | null;
  };
  name: string;
  variant: string | null;
};

export type PluginResult = {
  version: `${number}.${number}.${number}`;
  metadata: NonNullable<unknown>;
  collections: {
    name: string;
    modes: {
      name: string;
      variables: ColorVariable[];
    }[];
  }[];
};

export type ColorNonAliasMap = Map<string, ColorNonAliasObject>;

export type ColorAliasMap = Map<string, ColorAliasObject>;

export type ModeResultMap = Map<
  string,
  {
    colors: ColorNonAliasMap;
    aliases: ColorAliasMap;
  }
>;

export type CollectionResultMap = Map<string, ModeResultMap>;

export type StringRecord = Record<string, string>;

export type ColorSchema = Map<
  string,
  | {
      isAlias: boolean;
      value: StringRecord;
    }
  | {
      isAlias: boolean;
      value: string;
    }
  | {}
>;

export type ColorConfig = Record<string, string | StringRecord>;
