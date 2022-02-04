# semantic-mocha/no-member-only

Flags any member function call where the function name is `only`

## Examples

### Incorrect

```js
// Calling "only" on anything
foo.only()
```

### Correct

```js
// Not calling "only" on something
foo.bar();
```
