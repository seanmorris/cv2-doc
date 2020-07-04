import { Router } from 'curvature/base/Router';

import { View as BaseView } from 'curvature/base/View';

export class View extends BaseView
{
	constructor(args)
	{
		super(args);

		this.template = require('./view.tmp');

		this.args.prefix = '';
		this.args.filter = this.args.filter || '';
		this.args.active = 'inactive';

		this.args.filteredClasses = this.args.filteredClasses || [];

		this.args.docs  = this.args.docs  || {};
		this.args.pages = this.args.pages || {};

		this.classBank = {};

		this.loaded    = false;

		this.args.bindTo('docs', (v) => {

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

				if(v)
				{
					Router.setQuery('q', v);
				}
				else
				{
					Router.setQuery('q', undefined);
				}

				this.args.filteredClasses = classes.filter(
					c => {
						if(!v)
						{
							return true;
						}

						return c.showClassname.match(new RegExp(v, 'i'))
					}
				).sort((a,b)=>{

					return a.showClassname.localeCompare(b.showClassname);

				});

			}, {wait: 300});

		}, {wait: 0});

	}

	click(event, clickedClass = '')
	{
		this.deactivate();
		
		event.stopPropagation();
		event.preventDefault();

		if(!clickedClass || typeof clickedClass === 'string')
		{
			Router.go('/' + clickedClass);
			return;
		}

		const pathname = '/class/' + encodeURIComponent(clickedClass.classname);

		Router.go(pathname);
	}

	activate()
	{
		this.args.active = 'active';
	}

	deactivate(event)
	{
		this.args.active = 'inactive';
	}

	encodeURI(x)
	{
		x.replace(' ', '-');

		return encodeURIComponent(x);
	}

	toJson(input)
	{
		console.log(input);

		return JSON.stringify(input);
	}

	pageLink(p)
	{
		const page = this.args.pages[p];

		if(!page)
		{
			return '#undefined';
		}

		return page.link || `/page/${this.encodeURI(p)}`;
	}

	pageTitle(p)
	{
		const page = this.args.pages[p];

		if(!page)
		{
			return '#undefined';
		}

		return page.title || p;
	}
}