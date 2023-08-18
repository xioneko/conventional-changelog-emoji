'use strict'

const conventionalChangelog = require('./conventional-changelog')
const parserOpts = require('./parser-opts')
const writerOpts = require('./writer-opts')
const recommendedBumpOpts = require('./conventional-recommended-bump')

module.exports = function (presetConfig) {
    if (typeof presetConfig === 'function') {
        const config = {}
        Promise.all([
            conventionalChangelog(config),
            parserOpts(config),
            recommendedBumpOpts(config),
            writerOpts(config)
        ]).then(([conventionalChangelog, parserOpts, recommendedBumpOpts, writerOpts]) => {
            presetConfig(null, {
                gitRawCommitsOpts: { noMerges: null },
                conventionalChangelog,
                parserOpts,
                recommendedBumpOpts,
                writerOpts
            })
        })
    } else {
        presetConfig = presetConfig ?? {}
        return Promise.all([
            conventionalChangelog(presetConfig),
            parserOpts(presetConfig),
            recommendedBumpOpts(presetConfig),
            writerOpts(presetConfig)
        ]).then(([conventionalChangelog, parserOpts, recommendedBumpOpts, writerOpts]) => ({
            conventionalChangelog,
            parserOpts,
            recommendedBumpOpts,
            writerOpts,
        }))
    }
}