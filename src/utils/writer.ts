import fs from 'fs-extra';
import path from 'node:path';
import { TokensBrucke } from '@/types/plugin';
import { extractTokens } from './extractor';
import { generateCss } from './generator';

export function writeCss(options: { json: TokensBrucke; dest: string }) {
  const tokens = extractTokens(options.json);
  const styles = generateCss(tokens);

  fs.ensureDirSync(path.resolve(options.dest, '..'));
  fs.writeFileSync(options.dest, styles.css);

  return styles;
}
