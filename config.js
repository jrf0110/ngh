module.exports = {
  repoUserUrl:      'https://api.github.com/user/repos'
, repoUrl:          'https://api.github.com/repos'
, issuesUrl:        'https://api.github.com/repos/:owner/:repo/issues'
, issueUrl:         'https://api.github.com/repos/:owner/:repo/issues/:id'
, pullRequestsUrl:  'https://api.github.com/repos/:owner/:repo/pulls'
, token:            process.env['NGH_ACCESS_TOKEN']
, defaultEditor:    'vim'
};