import path from 'node:path';
import {
  CommandLineParser,
  CommandLineStringParameter,
} from '@rushstack/ts-command-line';
import { writeCss } from '@/utils/writer';

export class DesignTokenTransformer extends CommandLineParser {
  private writeLocation: CommandLineStringParameter;
  private sourceLocation: CommandLineStringParameter;

  constructor() {
    super({
      toolFilename: 'dt-transformer',
      toolDescription: 'Design Token Transformer',
    });

    this.sourceLocation = this.defineStringParameter({
      argumentName: 'SOURCE',
      parameterLongName: '--source',
      parameterShortName: '-s',
      description: 'Source location',
      required: true,
    });

    this.writeLocation = this.defineStringParameter({
      argumentName: 'DEST',
      parameterLongName: '--write',
      parameterShortName: '-w',
      description: 'Write location',
      required: true,
    });
  }

  protected async onExecute() {
    if (!this.sourceLocation.value) {
      throw new Error('Source location is required');
    }

    if (!this.writeLocation.value) {
      throw new Error('Write location is required');
    }

    const json = require(path.resolve(this.sourceLocation.value));

    writeCss({
      dest: path.resolve(this.writeLocation.value),
      json,
    });
  }
}
