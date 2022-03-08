import fs from 'fs';
import $RefParser from '@apidevtools/json-schema-ref-parser';

const NORMALIZED_SCHEMAS_DIR = 'src/utils/schemas/normalized/';

const promises = fs
  .readdirSync(NORMALIZED_SCHEMAS_DIR)
  .map((filePath) => `${NORMALIZED_SCHEMAS_DIR}${filePath}`)
  .map((filePath) => {
    const outputFilePath = filePath.replace(/normalized/, 'denormalized');

    const parser = new $RefParser();
    return parser.dereference(filePath).then((schema) => {
      fs.writeFileSync(outputFilePath, JSON.stringify(schema, null, 2));
    });
  });

Promise.all(promises)
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('Finished denormalizing schemas');
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.log(error);
    process.exit(1);
  });
