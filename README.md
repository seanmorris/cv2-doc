![avatar](https://avatars3.githubusercontent.com/u/640101?s=80&v=4)

# cv2-doc v0.0.0

cv2-doc renders documentation renders documentation generated by `idilic document`.

cv2-doc can be hosted in github pages.

cv2-doc is **serverless**.

## Getting started

Set up your app/Config.js file:

```js
export class Config {}

Config.title   = 'Ids - Sean Morris | cv2-doc'
Config.project = 'Ids'
Config.source  = 'https://raw.githubusercontent.com/seanmorris/ids/sm-dynamic-docs/asset/documentation.jsv';

Config.sourceRoot = 'https://github.com/seanmorris/ids/blob/master/';
Config.repository = 'seanmorris/ids';
Config.tagline    = 'The PHP + Docker Framework';

Config.author     = 'Sean Morris';
Config.copyright  = '2020 Sean Morris';

Config.homeLinks  = {
	github:      'https://github.com/seanmorris/ids'
	, packagist: 'https://packagist.org/packages/seanmorris/ids'
};

```

Start up a dry run:


```bash
$ npm i -g brunch
$ npm i cv2-doc
$ brunch watch -s
```

Build compiled JS & CSS:

```bash
$ brunch build -p
```