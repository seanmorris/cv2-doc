import { Config } from 'Config';

import { Repository } from 'curvature/base/Repository';
import { RuleSet } from 'curvature/base/RuleSet';
import { Router } from 'curvature/base/Router';

import { View as LayoutView } from './layout/View';
import { View as MenuView } from './menu/View';

import { RemoteFile } from './RemoteFile';

import { Head } from './Head';

document.addEventListener('DOMContentLoaded', () => {
	let l = 0;

	const pages  = Config.pages;
	const menu   = new MenuView();
	const layout = new LayoutView({menu,pages});
	const remote = new RemoteFile(Config.source);

	remote.readLines((line) => {

		const json = line.trim();

		if(!json)
		{
			return;
		}

		const chunk = JSON.parse(json);

		for(const doc of chunk)
		{
			if(doc && doc.classname)
			{
				layout.args.docs[ doc.classname ] = doc;
			}
		}

	}).finally(() => {

		const head = Head.get();

		menu.args.filter = Router.queryOver({}).q || '';

		RuleSet.add('body', layout);
		RuleSet.add('head', tag => head.render(tag.element));
		RuleSet.apply();

		Router.listen(layout);

	}).catch(error => {

		console.log(error)

	});
});
