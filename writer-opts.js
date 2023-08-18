'use strict'

const { readFile } = require('fs').promises
const { resolve } = require('path')

const config = {
    types: [
        { type: '✨', section: '✨ Features' },
        { type: '🐛', section: '🐛 Bug Fixes' },
        { type: '📝', hidden: true },
        { type: '🎨', hidden: true },
        { type: '♻️', hidden: true },
        { type: '⚡', section: '⚡ Performance' },
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

module.exports = async (presetConfig) => {
    if (presetConfig) {
        Object.assign(config, presetConfig)
    }

    return {
        transform,
        groupBy: 'type',
        commitGroupsSort,
        commitSort: ['subject'],
        noteGroupSort: 'title',
        ... await getFormat()
    }
}

function commitGroupsSort(a, b) {
    const { types } = config
    const aOrder = types.findIndex(({ section }) => a.title === section)
    const bOrder = types.findIndex(({ section }) => b.title === section)

    return aOrder - bOrder
}

async function getFormat() {
    const [
        template,
        header,
        commit,
        footer
    ] = await Promise.all([
        readFile(resolve(__dirname, './templates/template.hbs'), 'utf-8'),
        readFile(resolve(__dirname, './templates/header.hbs'), 'utf-8'),
        readFile(resolve(__dirname, './templates/commit.hbs'), 'utf-8'),
        readFile(resolve(__dirname, './templates/footer.hbs'), 'utf-8')
    ])

    const owner = '{{#if this.owner}}{{~this.owner}}{{else}}{{~@root.owner}}{{/if}}'
    const host = '{{~@root.host}}'
    const repository = '{{#if this.repository}}{{~this.repository}}{{else}}{{~@root.repository}}{{/if}}'

    const commitUrlFormat = expandTemplate(config.commitUrlFormat, {
        host, owner, repository
    })
    const compareUrlFormat = expandTemplate(config.compareUrlFormat, {
        host, owner, repository
    })
    const issueUrlFormat = expandTemplate(config.issueUrlFormat, {
        host, owner, repository,
        id: '{{this.issue}}',
        prefix: '{{this.prefix}}'
    })

    return {
        mainTemplate: template,
        headerPartial: header.replace(/{{compareUrlFormat}}/g, compareUrlFormat),
        commitPartial: commit
            .replace(/{{commitUrlFormat}}/g, commitUrlFormat)
            .replace(/{{issueUrlFormat}}/g, issueUrlFormat),
        footerPartial: footer,
    }
}

function transform(commit, context) {
    const entry = config.types.find((entry) => {
        return entry.type === commit.type
    })
    if (entry === undefined) return

    let special = false
    commit.notes.forEach(note => {
        note.title = 'BREAKING CHANGE'
        special = true
    })
    if (!special && entry.hidden) return

    commit.type = entry.section

    if (typeof commit.hash === 'string') {
        commit.shortHash = commit.hash.substring(0, 7)
    }

    const issues = []

    if (typeof commit.subject === 'string') {

        // #Issue link
        const issueRegEx = `(${config.issuePrefixes.join('|')})([0-9]+)`
        const re = new RegExp(issueRegEx, 'g')
        commit.subject = commit.subject.replace(re, (_, prefix, issue) => {
            issues.push(`${prefix}${issue}`)
            const url = expandTemplate(config.issueUrlFormat, {
                host: context.host,
                owner: context.owner,
                repository: context.repository,
                id: issue,
                prefix: prefix
            })
            return `[${prefix}${issue}](${url})`
        })
        // @User link
        commit.subject = commit.subject.replace(/\B@([a-z0-9](?:-?[a-z0-9/]){0,38})/g, (_, user) => {
            if (user.includes('/')) {
                return `@${user}`
            }

            const usernameUrl = expandTemplate(config.userUrlFormat, {
                host: context.host,
                owner: context.owner,
                repository: context.repository,
                user: user
            })

            return `[@${user}](${usernameUrl})`
        })
    }
    commit.references = commit.references.filter(reference => {
        if (issues.indexOf(reference.prefix + reference.issue) === -1) {
            return true
        }
        return false
    })

    return commit
}

/**
 * @param {string} template consist of "{{key}}"
 * @param {Object} context key/value pairs for replacement
 * @returns expanded content
 */
function expandTemplate(template, context) {
    let expanded = template
    Object.keys(context).forEach(key => {
        expanded = expanded.replace(new RegExp(`{{${key}}}`, 'g'), context[key])
    })
    return expanded
}