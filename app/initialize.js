import { Router } from 'curvature/base/Router';
import { RuleSet } from 'curvature/base/RuleSet';

import { View as LayoutView } from './layout/View';
import { View as MenuView } from './menu/View';

document.addEventListener('DOMContentLoaded', () => {

	const docsStrings = require('docs.tmp');

	const docs = {};

	docsStrings.split(/\n/).filter(line=>line).map(line => {
		const classes = JSON.parse(line);

		for(const c of classes)
		{
			docs[c.classname] = c;
		}
	});

	const menu   = new MenuView({docs});
	const layout = new LayoutView({menu, docs});
	
	RuleSet.add('body', layout);
	RuleSet.apply();
	
	Router.listen(layout);

});
