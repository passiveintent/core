# Publishing Guide

Use this when cutting the next npm release from this repo.

Semver:

- major: breaking API or behavior changes
- minor: new backward-compatible features
- patch: bug fixes only

For the current correction, `@passiveintent/core` should move from the mistaken `1.0.1` to `1.1.0`.

## Release Checklist

1. Update the release notes in `CHANGELOG.md`.
2. Bump the package version you are releasing.
3. Update dependent package ranges only if compatibility changed.
4. Run the release checks.
5. Publish `@passiveintent/core` first.
6. Publish `@passiveintent/react` after core, if React is part of the release.
7. Verify npm and StackBlitz.

## Version Bumps

```bash
cd packages/core
npm version 1.1.0 --no-git-tag-version

cd ../react
npm version 1.1.0 --no-git-tag-version

cd ../..
npm install
```

Use exact versions if you are doing a lockstep release. Use `patch`, `minor`, or `major` only when you want npm to calculate the next version for you.

```bash
cd packages/core
npm version major

npm version minor

npm version patch
```

## What To Update

- `packages/core/package.json`
- `packages/react/package.json`
- `package-lock.json`
- `CHANGELOG.md`

Do **not** change `demo/package.json` or `demo-react/package.json` — both use `"latest"` which always resolves to the newest published version automatically.

## Demo / StackBlitz Rules

Both demos pin their dependencies to `"latest"`:

```json
"@passiveintent/core": "latest"
"@passiveintent/react": "latest"
```

This means:

- No `demo/package.json` or `demo-react/package.json` changes are ever needed on release
- StackBlitz always installs the newest published version
- The only required post-publish step is refreshing `package-lock.json` (see below), so `npm ci` in CI resolves to the new version instead of the previously locked one

**After every publish**, run:

```bash
npm install --package-lock-only
git add package-lock.json
git commit -m "chore: refresh lock file after vX.Y.Z publish"
```

If you forget this step, CI will fail with:

```text
npm error Missing: @passiveintent/core@X.Y.Z from lock file
```

## Release Checks

```bash
npm whoami
npm ci
npm run typecheck
npm run test
npm run build
npm run verify:package -w @passiveintent/core
npm pack --dry-run -w @passiveintent/react
```

Run these too if the release touched those areas:

```bash
npm run test:e2e -w @passiveintent/core
npm run test:perf:all -w @passiveintent/core
```

## Publish Order

```bash
cd packages/core
npm login
npm pack --dry-run
npm publish --access public
npm view @passiveintent/core version

cd ../react
npm pack --dry-run
npm publish --access public
npm view @passiveintent/react version
```

Publish React only if it changed.

## Finish

```bash
git add CHANGELOG.md package-lock.json packages/core/package.json packages/react/package.json demo/package.json demo-react/package.json
git commit -m "release: vX.Y.Z"
git tag vX.Y.Z
git push origin main
git push origin vX.Y.Z
```

Trim the `git add` list if some packages were not part of the release.

## If You Published The Wrong Version

Do not republish the same version.

Use npm metadata instead:

```bash
npm dist-tag add `@passiveintent/core`@1.1.0 latest
npm deprecate `@passiveintent/core`@1.0.1 "Incorrect semver. Use >=1.1.0 instead."
```
