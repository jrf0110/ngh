# ngh - Github client

Github API client with CLI

__Install:__

```
npm install -g ngh
```

Create a [Github Personal Access Token](https://github.com/settings/applications). Export it in your environment as `NGH_ACCESS_TOKEN`.

__CLI Usage:__

```
  Usage: ngh [options] [command]

  Commands:

    create [options] [name] creates a new repository
    remove [org/name]       removes a new repository

  Options:

    -h, --help     output usage information
    -V, --version  output the version number
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