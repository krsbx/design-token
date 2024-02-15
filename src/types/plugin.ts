export type FigmaInfo = {
  variableId: string;
  collection: {
    id: string;
    name: string;
    defaultModeId: string;
  };
};

export type FigmaExtension = {
  mode: NonNullable<unknown>;
  figma: FigmaInfo;
};

export type Variable = {
  type: string;
  value: string | `{${string}}`;
  description: string;
  $extensions: FigmaExtension;
};

// Without variants
export type DesignToken = Record<string, Variable>;

// With variants
export type BaseTokensBrucke = Record<string, DesignToken>;

export type SubCollection = BaseTokensBrucke | DesignToken | Variable;

export type TokensBrucke = {
  [collection: string]: {
    [subcolletion: string]: SubCollection;
  };
};

// Maps
export type TokenMap = Map<string, Variable>;

export type StringMap = Map<string, string>;

export type StyleMap = Map<string, StringMap>;
