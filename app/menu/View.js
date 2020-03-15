import { Router } from 'curvature/base/Router';

import { View as BaseView } from 'curvature/base/View';

export class View extends BaseView
{
	constructor(args)
	{
		super(args);

		this.template = require('./view.tmp');

		this.args.prefix = '';
		this.args.filter = '';
		this.args.active = 'inactive';

		this.args.filteredClasses = this.args.filteredClasses || [];

		this.args.docs = this.args.docs || [];

		this.classBank = {};

		this.args.bindTo('filter', (v) => {

			const prefix = this.args.prefix;

			const classes = Object.keys(this.args.docs).map(c => {

				if(!this.classBank[c])
				{
					this.classBank[c] = this.args.docs[c];
					this.args.docs[c].showClassname = c;
				}

				return this.args.docs[c];
			});

			Router.setQuery('q', v);

			this.args.filteredClasses = classes.filter(

				c => c.showClassname.match(new RegExp(v, 'i'))

			).sort((a,b)=>{

				return a.showClassname.localeCompare(b.showClassname);

			});
		}, {wait: 300});
	}

	click(event, clickedClass)
	{
		event.stopPropagation();
		event.preventDefault();

		const pathname = '/class/' + encodeURIComponent(clickedClass.classname);
		this.args.active = 'inactive';

		Router.go(pathname);
	}

	startClick()
	{
		this.args.active = 'active';
	}

	deactivate(event)
	{
		this.args.active = 'inactive';
	}

	encodeURI(x)
	{
		return encodeURIComponent(x);
	}
}