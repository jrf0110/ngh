module.exports = {
  repoUserUrl:      'https://api.github.com/user/repos'
, repoUrl:          'https://api.github.com/repos'
, issuesUrl:        'https://api.github.com/repos/:owner/:repo/issues'
, issueUrl:         'https://api.github.com/repos/:owner/:repo/issues/:id'
, pullRequestsUrl:  'https://api.github.com/repos/:owner/:repo/pulls'
, token:            process.env['NGH_ACCESS_TOKEN']
, defaultEditor:    'vim'
, ghauth: {
    configName:     'ngh'
  , userAgent:      'ngh'
  , scopes:         ['repo', 'write:repo_hook', 'delete_repo', 'user']
  , note:           'NGH CLI'
  }
};