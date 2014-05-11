module.exports = {
  repoUserUrl: 'https://api.github.com/user/repos'
, repoUrl: 'https://api.github.com/repos'
, issuesUrl: 'https://api.github.com/repos/:owner/:repo/issues'
, issueUrl: 'https://api.github.com/repos/:owner/:repo/issues/:id'
, token: process.env['NGH_ACCESS_TOKEN']
, defaultEditor: 'vim'
};