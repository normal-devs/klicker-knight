# Custom Eslint Rules

We are using [eslint-plugin-local-rules](https://github.com/cletusw/eslint-plugin-local-rules)
to enable in-project eslint rules.
The plugin imports custom rules from a commonjs module located in [index.js](./index.js)

## Adding New Rules

1. Add a new rule file to a sub-directory in [src/](./src)
    - For easier debugging and rule management, use the [utils]('./src/utils.ts').
This way the rule file itself owns its own rule name.
    - Setup the rule name and the outline of the module
1. Write a test for the rule in [tests/](./src)
1. TDD FTW `npm run test:custom-eslint-rules`
1. Add and link a markdown file for the rule in [docs]('./docs/')
1. Import and export rules out of [src/index.ts]('./src/index.ts)
    - For easier debugging, each rule should have a name with a known string type.
This way the type of the export object can be inspected in the editor.
1. Update [.eslintrc.js](../.eslintrc.js) rules with `local-rules(your-rule-name)`
