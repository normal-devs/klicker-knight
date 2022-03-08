import { RuleParams } from 'markdownlint';
import { posix } from 'path';

export type InputFileData = {
  inputFilePath: string;
  inputFileName: string;
  inputDirectoryPath: string;
};

export const getInputFileData = (params: RuleParams): InputFileData => {
  const inputFilePath = params.name;

  return {
    inputFilePath,
    inputFileName: posix.basename(inputFilePath),
    inputDirectoryPath: `${posix.dirname(inputFilePath)}/`,
  };
};
