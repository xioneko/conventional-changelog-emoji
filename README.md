# 😜 conventional-changelog-emoji

Emoji-style conventional-changelog, modified from [conventional-changelog-conventionalCommits](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-conventionalcommits).

## install

```bash
npm install -D https://github.com/xioneko/conventional-changelog-emoji.git
```

## Configuration
Describe on [Conventional Changelog Configuration Spec](https://github.com/conventional-changelog/conventional-changelog-config-spec)


### Default config
```js
{
    types: [
        { type: '✨', section: '✨ Features' },
        { type: '🐛', section: '🐛 Bug Fixes' },
        { type: '⚡', section: '⚡ Performance' },
        { type: '📝', hidden: true },
        { type: '🎨', hidden: true },
        { type: '♻️', hidden: true },
        { type: '✅', hidden: true },
        { type: '🔖', hidden: true },
        { type: '🔨', hidden: true },
        { type: '⚙️', hidden: true },
        { type: '⏫', hidden: true },
    ],
    issueUrlFormat: '{{host}}/{{owner}}/{{repository}}/issues/{{id}}',
    commitUrlFormat: '{{host}}/{{owner}}/{{repository}}/commit/{{hash}}',
    compareUrlFormat: '{{host}}/{{owner}}/{{repository}}/compare/{{previousTag}}...{{currentTag}}',
    userUrlFormat: '{{host}}/{{user}}',
    issuePrefixes: ['#'],
}
```

## Recipes

### semantic-release
see [semantic-release config](https://semantic-release.gitbook.io/semantic-release/usage/configuration)
#### plugins
- [@semantic-release/commit-analyzer](https://github.com/semantic-release/commit-analyzer#configuration)
- [@semantic-release/release-notes-generator](https://github.com/semantic-release/release-notes-generator#configuration)
- [@semantic-release/changelog](https://github.com/semantic-release/changelog#configuration)
- [@semantic-release/npm](https://github.com/semantic-release/npm#environment-variables)
- [@semantic-release/github](https://github.com/semantic-release/github#configuration)
- [@semantic-release/git](https://github.com/semantic-release/git#configuration)

#### .releaserc
```js
module.exports = {
    branches: ['main', 'master'],
    plugins: [
        [
            '@semantic-release/commit-analyzer',
            {
                config: 'conventional-changelog-emoji',
                releaseRules: [
                    { breaking: true, release: 'major' },
                    { type: '✨', release: 'minor' },
                    { type: '🐛', release: 'patch' },
                    { type: '⚡️', release: 'patch' },
                    { revert: true, release: false },
                ]
            }
        ],
        [
            '@semantic-release/release-notes-generator',
            {
                config: 'conventional-changelog-emoji',
                linkCompare: true,
                linkReferences: true,
            }
        ],
        [
            '@semantic-release/changelog',
            {
                changelogFile: 'CHANGELOG.md',
            }
        ],
        [
            "@semantic-release/npm",
            {
                npmPublish: false,
                pkgRoot: '.',
            }
        ],
        '@semantic-release/github',
        [
            '@semantic-release/git',
            {
                assets: ['CHANGELOG.md', 'package.json'],
                message: '🔖 Release v${nextRelease.version}\n\n[skip ci]'
            }
        ]
    ]
}
```

### commitlint

see [commitlint config](https://commitlint.js.org/#/reference-configuration)

```js
// commitlint.config.cjs

module.exports = {
    parserPreset: 'conventional-changelog-emoji',
    rules: {
        'subject-max-length': [2, 'always', 80],
        'subject-case': [2, 'always', ['sentence-case'],],
        'subject-empty': [2, 'never'],
        'subject-full-stop': [2, 'never', '.'],
        'type-empty': [2, 'never'],
        'type-enum': [
            2,
            'always',
            [
                '✨', // feat
                '🐛', // fix
                '⚡', // Pref
                '📝', // docs
                '🎨', // style
                '♻️', // refactor
                '✅', // test
                '🔖', // realease
                '🔨', // build
                '⚙️', // miscellaneous config
                '⏫', // upgrade deps
            ],
        ],
    },
}
```

### cz-customizable

see [cz-customizable](https://github.com/xioneko/cz-customizable)
#### install patched version
```bash
npm install -g https://github.com/xioneko/cz-customizable.git#patch
```

#### .cz-config.js
```js
module.exports = {
    types: [
        { value: '✨', name: '✨\tAdd or update features' },
        { value: '🐛', name: '🐛\tFix a bug' },
        { value: '⚡', name: '⚡\tImprove performance' },
        { value: '📝', name: '📝\tAdd or update documentation' },
        { value: '🎨', name: '🎨\tBeautify the code' },
        { value: '♻️', name: '♻️\tRefactor code' },
        { value: '✅', name: '✅\tAdd, update, or pass tests' },
        { value: '🔖', name: '🔖\tRelease a new version' },
        { value: '🔨', name: '🔨\tBuild related' },
        { value: '⚙️', name: '⚙️\tChange miscellaneous configuration' },
        { value: '⏫', name: '⏫\tUpgrade dependencies' },
    ],

    messages: {
        type: "Select the type of change that you're committing:",
        subject: 'Write a SHORT, IMPERATIVE tense description of the change:\n',
        body: 'Provide a LONGER description of the change (optional). Use "|" to break new line:\n',
        breaking: 'List any BREAKING CHANGES (optional):\n',
        footer: 'List any ISSUES CLOSED by this change (optional). E.g.: #31, #34:\n',
        confirmCommit:
            'Are you sure you want to proceed with the commit above?',
    },

    subjectSeparator: ' ',
    usePreparedCommit: false,
    allowCustomScopes: true,
    allowBreakingChanges: ['✨', '🐛', '♻️', '⚡️', '🔨'],
    skipQuestions: ['scope'],
    skipEmptyScopes: true,

    subjectLimit: 80,
    breaklineChar: '|',
    footerPrefix: 'ISSUES CLOSED:',
    breakingPrefix: 'BREAKING CHANGE:',
    upperCaseSubject: true,
}
```