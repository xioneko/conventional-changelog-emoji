'use strict'

const parserOpts = require('./parser-opts')
const writerOpts = require('./writer-opts')

module.exports = function (presetConfig) {
    return Promise.all([parserOpts(presetConfig), writerOpts(presetConfig)])
        .then(([parserOpts, writerOpts]) => ({
            parserOpts,
            writerOpts
        }))
}