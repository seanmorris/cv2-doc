import { Repository } from 'curvature/base/Repository';

import { View as BaseView  } from 'curvature/base/View';
import { View as ClassPage } from '../classpage/View';
import { View as ModalView } from '../modal/View';

import { Loader } from './Loader';

import { Home      } from './Home';
import { WhatsThis } from './WhatsThis';
import { Info      } from './Info';

import { Head      } from '../Head';

import { Config    } from 'Config';


export class View extends BaseView
{
	constructor(args)
	{
		super(args);

		this.template     = require('./view.tmp');
		this.args.menu    = this.args.menu  || '';
		this.args.docs    = this.args.docs  || {};
		this.args.pages   = this.args.pages || {};
		this.args.modals  = ModalView.get();
		this.args.content = '';

		this.args.loader  = '';

		const docs  = this.args.docs;
		const pages = this.args.pages;
		const menu  = this.args.menu;

		const sync = prop => (v,k,t,d) => {
			if(!menu)
			{
				return;
			}

			menu.args[prop][k] = v;

			if(d)
			{
				delete menu.args[prop][k];
			}
		};

		docs.bindTo(sync('docs'));
		pages.bindTo(sync('pages'));

		this.templates = {};

		this.routes = {

			'': (args) => {

				return this.loadTemplatePage(
					Object.assign({}, args, {page:'home'})
				);

				return new Home;
			}

			, 'class/*': (args) => {

				return this.loadClassPage(args);

			}

			, 'page/%page': args => {

				return this.loadTemplatePage(args);

			}

			, false: (args) => {

				this.setStatusCode(404);

				console.log(404, args, location.pathname);

				return '404 - Page not found.';

			}
		};

		this.args.menuActive = '';

		this.args.menu.args.bindTo('active', (v) => {
			this.args.menuActive = `menu-${v}`;
		});
	}

	postRender()
	{
		Head.get().args.title = Config.title;

		if(document.body.offsetWidth > 650)
		{
			this.args.menu.activate();
		}
	}

	activateMenu()
	{
		this.args.menu.activate();
	}


	deactivateMenu()
	{
		this.args.menu.deactivate();
	}

	setStatusCode(code = 200)
	{
		Head.get().args.status = code;
	}

	loadClassPage(args)
	{
		const classname = decodeURIComponent(args.pathparts.join('\\'));
		const content   = new ClassPage();

		const debind = this.args.bindTo('docs', (v,k,t,d) => {

			this.setStatusCode(0);

			if(!v || !classname || !v[classname])
			{
				this.setStatusCode(404);
				return;
			}

			Object.assign(
				content.args
				, v[classname]
				, {dump: JSON.stringify(v[classname], null, 4)}
			);

			const contentTag = this.findTag('.main-content');

			contentTag && contentTag.scrollTo({top:0});

			document.activeElement.blur();
		});

		this.args.loader = new Loader;

		content.onRemove(debind);

		return new Promise(accept => {

			this.deactivateMenu();

			this.onTimeout(250, () => {
				this.setStatusCode(200);

				console.log(content.args.summary, content.args);

				Head.get().args.title = `${content.args.shortname} Class - ${Config.title}`;
				Head.get().args.description = content.args.notes.summary
					? `${content.args.notes.summary} - ${Config.title}`
					: `View the documentation for ${content.args.shortname} - ${Config.title}`;

				this.args.loader = '';

				accept(content);
			});

		});
	}

	loadTemplatePage(args)
	{
		this.setStatusCode(0);

		const pageKey = decodeURIComponent(args.page);
		const pages   = Config.pages;
		const page    = pages[ pageKey ];

		if(!page)
		{
			this.setStatusCode(404);

			document.activeElement.blur()
			return;
		}

		this.args.loader  = new Loader;

		return Repository.request(
			page.template
			, {}
			, false
			, true
			, {
				withCredentials: false
				, responseType: 'text'
				, headers: {
					'Accept': 'application/vnd.github.v3.html+json'
				}
			}
		).then(response => {

			const view = new BaseView(Object.assign({}, Config));

			view.template = response.response;

			this.templates['readme'] = response.response;

			document.activeElement.blur();

			this.deactivateMenu();

			this.args.content = '';

			return new Promise(accept => {

				Head.get().args.title = page.title
					? `${page.title} - ${Config.title}`
					: Config.title;

				Head.get().args.description = page.description
					? `${page.description}`
					: '';
				accept(view);

				this.setStatusCode(200);

				this.onTimeout(250, () => {

					this.args.loader = '';

				});

			});

			return view;

		}).catch((error) => {

			this.setStatusCode(500);

			console.log(error);

			return error.message || 'Unexpected error occurred.'

		});
	}
}
