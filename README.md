<!DOCTYPE markdown><!-- markdownlint-disable first-line-h1 no-inline-html -->
<meta charset="utf-8" content="text/markdown" lang="en">
<!-- -## editors ## (emacs/sublime) -*- coding: utf8-nix; tab-width: 2; mode: markdown; indent-tabs-mode: nil; basic-offset: 2; st-word_wrap: 'true' -*- ## (jEdit) :tabSize=2:indentSize=2:mode=markdown: ## (notepad++) vim:tabstop=2:syntax=markdown:expandtab:smarttab:softtabstop=2 ## modeline (see <https://archive.is/djTUD>@@<http://webcitation.org/66W3EhCAP> ) -->
<!-- spell-checker:ignore expandtab markdownlint modeline smarttab softtabstop -->

<!-- markdownlint-configure-file { "no-hard-tabs": { "code_blocks": false } } -->
<!-- markdownlint-disable heading-increment hr-style no-duplicate-heading no-emphasis-as-heading ul-style -->
<!-- spell-checker:ignore (project) dxlog LogLevel -->
<!-- spell-checker:ignore (people) rivy -->

# ... [ToDO: Project Title](...) ...

> 🦕 ... ToDO: Project description

## Usage

```deno
//... ToDO: example usage ...
//...
```

<small>

> ### Required Deno permissions
>
> ... ToDO ...
>
> #### `--allow-env` &middot; _allow access to the process environment variables_
>
> ... for access to `...` environment variable ...
>
> ##### `--allow-read` &middot; _allow read(-only) access to the file system_
>
> ... for access to config files and ability to write log files ...

</small>

## API

... ToDO ...

### Construction/Initialization

... ToDO ...

### Interfaces/Types

... ToDO ...

### Methods

... ToDO ...

## Example

```deno
// ... ToDO ...
```

## Supported Platforms

... ToDO ...

### Deno

... ToDO ...

## Discussion

... ToDO ...

### Origins

... ToDO ...

## Development and Testing

<!-- [![Repository][repository-image]][repository-url] [![Build status (GHA)][gha-image]][gha-url] [![Build status (Travis-CI)][travis-image]][travis-url] [![Build status (AppVeyor)][appveyor-image]][appveyor-url] [![Coverage status][coverage-image]][coverage-url] -->
<!-- <br/> [![Quality status (Codacy)][codacy-image]][codacy-url] [![Quality status (CodeClimate)][codeclimate-image]][codeclimate-url] [![Quality status (CodeFactor)][codefactor-image]][codefactor-url] -->

### Development requirements

- Deno >= 1.10

> ### Tools
>
> - [`bmp`](https://github.com/rivy-go/git-changelog) (v1.1+) ... synchronizes version strings within the project
  > <br> install using `dxi --allow-read=. --allow-write=. --allow-run=git -qf https://deno.land/x/bmp@v0.0.6/cli.ts`
> - [`dprint`](https://dprint.dev) (v0.17+) ... formats project code
  > <br> install using `cargo install dprint`
> - [`dxr`](https://github.com/rivy/deno.dxx) (v0.0.9+) ... enables project development scripting
  > <br> install using `dxi -A "https://deno.land/x/dxx@v0.0.9/src/dxr.ts"`
> - [`git-changelog`](https://github.com/rivy-go/git-changelog) (v1.1+) ... enables changelog automation
  > <br> install using `go get -u github.com/rivy-go/git-changelog/cmd/git-changelog`

### Maintenance

#### CHANGELOG

`git changelog > CHANGELOG.mkd`

#### Version

- `bmp` ~ check project for synchronized version strings
- `bmp --commit --[major|minor|patch]` ~ update project version strings

### Version update process

```shell
bmp --[major|minor|patch]
git changelog --next-tag v$(cat VERSION) > CHANGELOG.mkd
bmp --commit
```

## Testing

`deno test`

### Project development scripts

```shell
dxr help
... ToDO ...
```

### Contributions

Contributions are welcome.

Any pull requests should be based off of the default branch (`master`). And, whenever possible, please include tests for any new code, ensuring that local (via `deno test`) and remote CI testing passes.

By contributing to the project, you are agreeing to provide your contributions under the same [license](./LICENSE) as the project itself.

## Related

... ToDO ...

## License

[MIT](./LICENSE) © [Roy Ivy III](https://github.com/rivy)

<!-- badge references -->

<!-- Repository -->
<!-- Note: for '[repository-image] ...', `%E2%81%A3` == utf-8 sequence of "Unicode Character 'INVISIBLE SEPARATOR' (U+2063)"; ref: <https://codepoints.net/U+2063> -->

[repository-image]: https://img.shields.io/github/v/tag/rivy/js.xdg-app-paths?sort=semver&label=%E2%81%A3&logo=github&logoColor=white
[repository-url]: https://github.com/rivy/js.xdg-app-paths
[license-image]: https://img.shields.io/npm/l/xdg-app-paths.svg?color=tomato&style=flat
[license-url]: license
[nodejsv-image]: https://img.shields.io/node/v/xdg-app-paths?color=slateblue
[style-image]: https://img.shields.io/badge/code_style-prettier-mediumvioletred.svg
[style-url]: https://prettier.io

<!-- Continuous integration/deployment (CICD) -->

[appveyor-image]: https://img.shields.io/appveyor/ci/rivy/js-xdg-app-paths/master.svg?style=flat&logo=AppVeyor&logoColor=deepskyblue
[appveyor-url]: https://ci.appveyor.com/project/rivy/js-xdg-app-paths
[gha-image]: https://img.shields.io/github/workflow/status/rivy/js.xdg-app-paths/CI?label=CI&logo=github
[gha-url]: https://github.com/rivy/js.xdg-app-paths/actions?query=workflow%3ACI
[travis-image]: https://img.shields.io/travis/rivy/js.xdg-app-paths/master.svg?style=flat&logo=travis
[travis-url]: https://travis-ci.org/rivy/js.xdg-app-paths

<!-- Code quality -->

[coverage-image]: https://img.shields.io/codecov/c/github/rivy/js.xdg-app-paths/master.svg
[coverage-url]: https://codecov.io/gh/rivy/js.xdg-app-paths
[codeclimate-url]: https://codeclimate.com/github/rivy/js.xdg-app-paths
[codeclimate-image]: https://img.shields.io/codeclimate/maintainability/rivy/js.xdg-app-paths?label=codeclimate
[codacy-image]: https://img.shields.io/codacy/grade/6f019c41b12b4c35a5ac5693744e4b96?label=codacy
[codacy-url]: https://app.codacy.com/gh/rivy/js.xdg-app-paths/dashboard
[codefactor-image]: https://img.shields.io/codefactor/grade/github/rivy/js.xdg-app-paths?label=codefactor
[codefactor-url]: https://www.codefactor.io/repository/github/rivy/js.xdg-app-paths

<!-- Distributors/Registries -->

[deno-image]: https://img.shields.io/github/v/tag/rivy/js.xdg-app-paths?label=deno
[deno-url]: https://deno.land/x/xdg_app_paths
[downloads-image]: http://img.shields.io/npm/dm/xdg-app-paths.svg?style=flat
[downloads-url]: https://npmjs.org/package/xdg-app-paths
[jsdelivr-image]: https://img.shields.io/jsdelivr/gh/hm/rivy/js.xdg-app-paths?style=flat
[jsdelivr-url]: https://www.jsdelivr.com/package/gh/rivy/js.xdg-app-paths
