# Custom Markdownlint Rules

## Rule Documentation

### Directory Link has Trailing Slash

Markdown links that point to directories must end in `/`.

### Valid Anchor Reference

Markdown links with anchor tag references must link to a real heading in the referenced file.

### Valid File Reference

Markdown links to files and directories must resolve to a file or directory in the project.

## Creating a New Rule

1. Scaffold a new rule in [./src/rules/](./src/rules/)
    - Use the other [rules](./src/rules/) and [CustomRules.md](https://github.com/DavidAnson/markdownlint/blob/main/doc/CustomRules.md)
    as a reference
    - Leave the "function" body empty for now
1. In any desired order:
    - Write tests
        1. [Scaffold the tests](#scaffolding-tests) (good place to start for TDD)
        1. [Implement the tests](#implementing-rule-tests)
    - [Implement the rule](#implementing-a-rule)
    - [Expose the rule](#exposing-a-rule)
    (good place to start for your first rule)
1. Document your rule under [Rule Documentation](#rule-documentation) in this file

### Scaffolding Tests

1. Create a file under [./tests/rules/](./tests/rules/) with the same name as the variable exported from your rule file
    1. Copy the contents of another test file from the same directory
    1. Clear the contents of the "expectedErrors" object
    1. Make sure all references to the rule export are updated
1. Create a new folder for your **rule name** (ruleExport.names[0], not the ruleExport identifier) under [./tests/test-input/](./tests/test-input/)
    1. Under this folder create the following folders (don't worry about adding test files until you
    [implement the rule tests](#implementing-rule-tests)):
        - valid/: holds example files with text that passes the rule
        - invalid/: holds example files with text that fail the rule
        - ignored/ (optional): holds example files with bad input that are out of scope for the rule
        - mocks/: any additional files needed for tests should go here

### Implementing Rule Tests

After [scaffolding the test](#scaffolding-tests),
you should see a call to [testRule](./tests/testRule.ts).
This test utility automatically grabs any files under the "valid/", "invalid/" and "ignored/" directories
for the rule under test, and derives test cases from these files.

1. Add files to "valid/" and "invalid/"
    - Files should not have an `.md` extension (so the editor linter doesn't complain)
1. Update the "expectedErrors" object
    - Keys should match file names of files under "invalid/"
    - See other tests for example values
1. Run the tests with `npm run test:custom-markdownlint:rules`

### Implementing a Rule

1. Update the function body of the "function" key for your rule
    1. Filter "params.tokens" down to the token type you're interested in linting
    1. Derive and gather additional information about the tokens
    1. Filter the tokens down to ones that violate the rule
        1. Call the onError callback to notify markdownlint of failing code

### Exposing a Rule

1. Import your rule into [./src/rules/index.ts](./src/rules/index.ts)
1. Add your rule to the export list
1. In vscode you might need to run the
"Developer: Reload Window" command from the command palette
in order for the markdownlint extension to pick up the rule
