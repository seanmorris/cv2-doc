import { Config } from 'Config';

import { Repository } from 'curvature/base/Repository';
import { RuleSet } from 'curvature/base/RuleSet';
import { Router } from 'curvature/base/Router';

import { View as LayoutView } from './layout/View';
import { View as MenuView } from './menu/View';

document.addEventListener('DOMContentLoaded', () => {
	const menu   = new MenuView();
	const layout = new LayoutView({menu});
	
	RuleSet.add('body', layout);
	RuleSet.apply();
	
	Router.listen(layout);
	Repository.request(
		Config.source
		, {}, false, true, {
			withCredentials: false
			, responseType: 'text'
			, headers: {
				'Accept':   'application/vnd.github.v3.html+json'
			}
		}
	).then(response => {

		const docsStrings = response.response;
		const docs = {};

		docsStrings.split(/\n/).filter(line=>line).map(line => {
			const classes = JSON.parse(line);

			for(const c of classes)
			{
				docs[c.classname] = c;
			}
		});

		layout.args.docs = menu.args.docs = docs;
	}).catch(error => console.log(error) );
});
