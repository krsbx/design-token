import path from 'node:path';
import {
  CommandLineParser,
  CommandLineStringParameter,
  CommandLineChoiceParameter,
} from '@rushstack/ts-command-line';
import { Extension } from '@/utils/constant';
import { writeConfig } from '../utils/writer';

export class DesignTokenTransformer extends CommandLineParser {
  private writeLocation: CommandLineStringParameter;
  private sourceLocation: CommandLineStringParameter;
  private extension: CommandLineChoiceParameter;

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

    this.extension = this.defineChoiceParameter({
      alternatives: ['js', 'ts'],
      description: 'Extension of the generated file',
      parameterLongName: '--extension',
      parameterShortName: '-e',
      defaultValue: 'ts',
    });
  }

  protected async onExecute() {
    if (!this.sourceLocation.value) {
      throw new Error('Source location is required');
    }

    if (!this.writeLocation.value) {
      throw new Error('Write location is required');
    }

    if (!this.extension.value) {
      throw new Error('Extension is required');
    }

    const json = require(path.resolve(this.sourceLocation.value));

    writeConfig({
      json,
      writeLocation: this.writeLocation.value,
      extension: this.extension.value as Extension,
    });
  }
}
