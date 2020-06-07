module.exports = {
  '*.{ts}': ['eslint --fix --quiet'],
  '*.{ts,js,json,md,yml}': ['prettier --write'],
}
