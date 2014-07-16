# ngh - Github client

Github API client with CLI

![ngh issues in action](http://storage.j0.hn/ngh.gif)

__Install:__

```
npm install -g ngh
```

___Optionally___ create a [Github Personal Access Token](https://github.com/settings/applications) and export it in your environment as `NGH_ACCESS_TOKEN`.

__CLI Usage:__

```
  Usage: ngh [options] [command]

  Commands:

    create [options] [name] creates a new repository
    remove [org/name]      removes a new repository
    open [options] [issue_number] opens or re-opens an issue
    close [options] <issue_number> closes an issue
    issues [options] [org/name] lists issues for org/name or current repo
    issue [options] <issue_number> View and edit an issue
    pull [options] [issue_number] Open a pull request optionally with attached to an issue

  Options:

    -h, --help     output usage information
    -V, --version  output the version number
    --token        Specifies your github personal access token
```

__Example:__

```
$ ngh create test
Created repository: test
Push an existing repository
  git remote add origin git@github.com:jrf0110/ngh.git
  git push -u origin master
```

__Example:__

List issues in current repo, write to file as json

```
$ ngh issues --format json > issues.json
```

## API

The actual client can be found in `index.js`.

### .createClient( options )

Returns an ngh client.

__Options:__

```javascript
{
  // Your Github personal access token
  token
}
```

## ngh client API

### .createRepo( name, [options], callback )

Creates a repository.

__Options:__

```javascript
{
  // string  A short description of the repository
  description
  // string  A URL with more information about the repository
, homepage
  // boolean Either true to create a private repository, or false to create a public one. Creating private repositories requires a paid GitHub account. Default: false
, private
  //  boolean Either true to enable issues for this repository, false to disable them. Default: true
, has_issues
  // boolean Either true to enable the wiki for this repository, false to disable it. Default: true
, has_wiki
  // boolean Either true to enable downloads for this repository, false to disable them. Default: true
, has_downloads
  // number  The id of the team that will be granted access to this repository. This is only valid when creating a repository in an organization.
, team_id
  // boolean Pass true to create an initial commit with empty README. Default: false
, auto_init
  // string  Desired language or platform .gitignore template to apply. Use the name of the template without the extension. For example, “Haskell”. Ignored if the auto_init parameter is not provided.
, gitignore_template
  // string  Desired LICENSE template to apply. Use the name of the template without the extension. For example, “mit” or “mozilla”. Ignored if the auto_init parameter is not provided.
, license_template
}
```

__Example:__

```javascript
var ngh = require('ngh');
var gh = ngh.createClient();
gh.createRepo( 'some-repo', function( error ){
  /* ... */
});
```

### .removeRepo( name, callback )

Removes a repository

__Example:__

```javascript
var ngh = require('ngh');
var gh = ngh.createClient();
gh.createRepo( 'some-repo', function( error ){
  /* ... */
});
```

### .createIssue( options, callback )

Creates an issue.

__Options:__

```javascript
{
  // Owner of the repository
  organization
  // Name of the repository
, repo
  // string  Required. The title of the issue.
, title
  // string  The contents of the issue.
, body
  // string  Login for the user that this issue should be assigned to. NOTE: Only users with push access can set the assignee for new issues. The assignee is silently dropped otherwise.
, assignee
  //number  Milestone to associate this issue with. NOTE: Only users with push access can set the milestone for new issues. The milestone is silently dropped otherwise.
, milestone
  // array of strings  Labels to associate with this issue. NOTE: Only users with push access can set labels for new issues. Labels are silently dropped otherwise.
, labels
}
```

### .editIssue( options, callback )

Edit an issue.

__Options:__

```javascript
{
  // This is actually the issue number
  id
  // Owner of the repository
, organization
  // Name of the repository
, repo
  // string  Required. The title of the issue.
, title
  // string  The contents of the issue.
, body
  // string  Login for the user that this issue should be assigned to. NOTE: Only users with push access can set the assignee for new issues. The assignee is silently dropped otherwise.
, assignee
  //number  Milestone to associate this issue with. NOTE: Only users with push access can set the milestone for new issues. The milestone is silently dropped otherwise.
, milestone
  // array of strings  Labels to associate with this issue. NOTE: Only users with push access can set labels for new issues. Labels are silently dropped otherwise.
, labels
}
```

### .getIssues( options, callback )

Gets an array of issue objects

__Options:__

```javascript
{
  // Owner of the repository
  organization
  // Name of the repository
, repo
```

### .getIssue( options, callback )

Gets the issue object

__Options:__

```javascript
{
  // This is actually the issue number
  id
  // Owner of the repository
, organization
  // Name of the repository
, repo
```

### .openPullRequest( options, callback )

Opens a pull request

__Options:__

```javascript
{
  // string  Required (unless issue specified). The title of the pull request.
  title
  // number  The issue number you're attach the PR to
, issue
  // string  Required. The name of the branch where your changes are implemented. For cross-repository pull requests in the same network, namespace head with a user like this: username:branch.
, head
  // string  Required. The name of the branch you want your changes pulled into. This should be an existing branch on the current repository. You cannot submit a pull request to one repository that requests a merge to a base of another repository.
, base
  // string  The contents of the pull request.
, body
}
```