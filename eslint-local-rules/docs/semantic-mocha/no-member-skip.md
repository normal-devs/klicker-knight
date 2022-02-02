# semantic-mocha/no-member-skip

Flags any member function call where the function name is `skip`

## Examples

### Incorrect

```js
// Calling "skip" on anything
foo.skip()
```

### Correct

```js
// Not calling "skip" on something
foo.bar();
```
