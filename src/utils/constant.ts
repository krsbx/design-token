export const EXTENSION = {
  TS: 'ts',
  JS: 'js',
} as const;

export type Extension = (typeof EXTENSION)[keyof typeof EXTENSION];
