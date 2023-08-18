'use strict'

module.exports = function (presetConfig) {
    return {
        headerPattern: /^([^\s]+) (.*)$/,
        headerCorrespondence: ['type', 'subject'],
        mergePattern: /^Merge pull request #(\d+) from (.*)$/,
        mergeCorrespondence: ['id', 'source'],
        referenceActions: ['ISSUES CLOSED:'],
        noteKeywords: ['BREAKING CHANGE'],
        revertPattern: /^(?:Revert|revert:)\s"?([\s\S]+?)"?\s*This reverts commit (\w*)\./i,
        revertCorrespondence: ['header', 'hash'],
        issuePrefixes: presetConfig?.issuePrefixes || ['#']
    }
}