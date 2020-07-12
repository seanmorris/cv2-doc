export class Config {}

Config.project = 'Ksqlc';
Config.version = '0.0.2';
Config.title   = 'Ksqlc℠ - Sean Morris | cv2-doc'
Config.source  = '/docs-20200701.tmp.jsv';

// Config.project = 'Ids'
// Config.title   = 'Ids - Sean Morris | cv2-doc'
// Config.source  = 'https://raw.githubusercontent.com/seanmorris/ids/sm-dynamic-docs/asset/documentation.jsv';

// Config.sourceRoot = 'https://github.com/seanmorris/ids/blob/sm-dynamic-docs/';
// Config.repository = 'seanmorris/ids';
// Config.tagline    = 'The PHP + Docker Framework';

// Config.author     = 'Sean Morris';
// Config.copyright  = '2011-2020 Sean Morris';

// Config.homeLinks  = {
// 	github:      'https://github.com/seanmorris/ids'
// 	, packagist: 'https://packagist.org/packages/seanmorris/ids'
// };

Config.repository = 'seanmorris/ksqlc';
Config.tagline    = 'The PHP KSQL Connector';

Config.sourceRoot = `https://github.com/${Config.repository}/blob/master/`;

Config.copyright  = '2020 Sean Morris';
Config.author     = 'Sean Morris';

Config.homeLinks  = {
	github:      'https://github.com/seanmorris/Ksqlc'
	, packagist: 'https://packagist.org/packages/seanmorris/ksqlc'
};

Config.pages = {

	'home': {
		description: 'Ksqlc℠ provides a PHP interface to Confluent KSQL & Apache Kafka.'
		, linkTitle: 'home'
		, keywords:  ['ksql','php','ksqlc','sean morris','seanmorris']
		, title:     'The PHP KSQL Connector'
		, template:  `/home.tmp.html`
		, icon:      '/home.svg'
		, link:      '/'
	}

	, readme: {
		description: "Grab the URL to your KSQL server's REST endpoint, and it use it to create a new Ksqlc object to begin."
		, template:  `https://api.github.com/repos/${Config.repository}/contents/README.md`
		, title:     'readme'
		, icon:      '/readme.svg'
	}

	, license: {
		description: 'Ksqlc℠ is free for distribution, modification, and use under the Apache-2.0 license.'
		, template:  `https://api.github.com/repos/${Config.repository}/contents/LICENSE`
		, title:     'license'
		, icon:      '/apache.svg'
	}

	, author: {
		description: "I'm a New York based developer with a passion for the web. I currently specialize in PHP & Javascript. I've been doing web development full time since I was seventeen years old. Before that I've always had some sort of hobby project online. I launched my first website in 1998."
		, keywords:  ['sean morris','php','developer','programmer','javascript','new york','seanmorris']
		, template:  `/author.tmp.html`
		, title:     'about the author'
		, icon:      '/me.svg'
	}

	, 'whats-this': {
		description: 'cv2-doc renders documentation stored in github. cv2-doc can be hosted in github pages. cv2-doc is serverless.'
		, template:  '/whats-this.tmp.html'
		, title:     'whats this?'
		, icon:      '/info.svg'
	}

};
