import fs from 'fs-extra';
import path from 'node:path';
import { TokensBrucke } from '@/types/plugin';
import { extractTokens } from './extractor';
import { generateCss } from './generator';

export function writeCss(json: TokensBrucke, dest: string) {
  const tokens = extractTokens(json);
  const css = generateCss(tokens);

  fs.ensureDirSync(path.resolve(dest, '..'));
  fs.writeFileSync(dest, css);

  return css;
}
