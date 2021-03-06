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
		this.loaded    = false;

		this.args.bindTo('docs', (v) => {

			if(this.loaded || !Object.keys(v).length)
			{
				return;
			}

			this.loaded = true;

			const docs = v;

			this.args.bindTo('filter', (v) => {

				const prefix = this.args.prefix;

				const classes = Object.keys(docs).map(c => {

					if(!this.classBank[c])
					{
						this.classBank[c] = docs[c];
						
						docs[c].showClassname = c;
					}

					return docs[c];
				});

				if(v)
				{
					Router.setQuery('q', v);
				}
				else
				{
					Router.setQuery('q', '');
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
		return encodeURIComponent(x);
	}
}