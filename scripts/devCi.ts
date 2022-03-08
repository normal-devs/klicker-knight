import fs from 'fs';
import { execSync } from 'child_process';
import yaml from 'yaml';

const configText = fs.readFileSync('./.github/workflows/ci.yaml', 'utf8');
const config: unknown = yaml.parse(configText);

type Config = {
  jobs: {
    'klicker-knight-ci': {
      steps: {
        uses?: string;
        run?: string;
      }[];
    };
  };
};

const isObject = (data: unknown): data is Record<string, unknown> =>
  typeof data === 'object' && !Array.isArray(data) && data !== null;

const isExpectedConfig = (data: unknown): data is Config =>
  isObject(data) &&
  'jobs' in data &&
  isObject(data.jobs) &&
  'klicker-knight-ci' in data.jobs &&
  isObject(data.jobs['klicker-knight-ci']) &&
  'steps' in data.jobs['klicker-knight-ci'] &&
  Array.isArray(data.jobs['klicker-knight-ci'].steps);

if (!isExpectedConfig(config)) {
  throw Error('Unexpected config structure');
}

const runCommand = (name: string, command: string): void => {
  /* eslint-disable no-console */
  console.log(`Running: ${name}`);
  const result = execSync(command).toString();
  console.log(result);
  /* eslint-enable no-console */
};

config.jobs['klicker-knight-ci'].steps
  .filter(
    (step: unknown): step is { name: string; run: string } =>
      isObject(step) &&
      !('uses' in step) &&
      'name' in step &&
      typeof step.name === 'string' &&
      'run' in step &&
      typeof step.run === 'string',
  )
  .forEach((step) => runCommand(step.name, step.run));
