import { Repository } from 'curvature/base/Repository';

import { View as BaseView } from 'curvature/base/View';
import { View as ClassPage } from '../classpage/View';

import { Loader } from './Loader';

import { Home      } from './Home';
import { WhatsThis } from './WhatsThis';
import { Info      } from './Info';

import { Config    } from 'Config';


export class View extends BaseView
{
	constructor(args)
	{
		super(args);

		this.template     = require('./view.tmp');
		this.args.menu    = this.args.menu || '';
		this.args.content = '';

		const docs = this.args.docs;

		this.templates = {};

		this.routes = {

			'': (args) => {

				return new Home;
			}

			, 'readme': () => {

				if(this.templates['readme'])
				{
					const view = new BaseView;

					view.template = this.templates['readme'];
					
					return view;
				}

				this.args.content = new Loader;

				return Repository.request(
					'https://api.github.com/repos/'
						+ Config.repository
						+ '/contents/README.md'
					, {}, false, true, {
						withCredentials: false
						, responseType: 'text'
						, headers: {
							'Accept':   'application/vnd.github.v3.html+json'
						}
					}
				).then(response => {

					const view = new BaseView;

					view.template = response.response;

					this.templates['readme'] = response.response;

					return view;
				}).catch((error) => {

					console.log(error);

					return error.message || 'Unexpected error occurred.'

				});
			}

			, 'license': () => {

				if(this.templates['license'])
				{
					const view = new BaseView;

					view.template = this.templates['license'];
					
					return view;
				}

				this.args.content = new Loader;

				return Repository.request(
					'https://api.github.com/repos/'
						+ Config.repository
						+ '/contents/LICENSE'
					, {}, false, true, {
						withCredentials: false
						, responseType: 'text'
						, headers: {
							'Accept':   'application/vnd.github.v3.html+json'
						}
					}
				).then(response => {

					const view = new BaseView;

					view.template = response.response;

					this.templates['license'] = response.response;

					return view;

				}).catch((error) => {

					console.log(error);

					return error.message || 'Unexpected error occurred.'

				});
			}

			, 'whatsthis': () => {

				return new WhatsThis;
			}

			, 'info': () => {

				console.log('home', args);

				return new Info;
			}

			, 'class/*': (args) => {

				const content = new ClassPage();

				const classname = decodeURIComponent(args.pathparts.join('\\'));
				
				const debind = this.args.bindTo('docs',
					(v,k,t,d) => {
						if(!v || !classname || !v[classname])
						{
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
					}
				);

				content.onRemove(debind);

				return content;
			}

			, false: (args) => {

				console.log(404, args, location.pathname);

				return '404 - Page not found.';

			}
		};

		this.args.menuActive = '';

		this.args.menu.args.bindTo('active', (v) => {
			this.args.menuActive = `menu-${v}`;
		});

		this.onTimeout(75, ()=> this.args.menuActive = `menu-active`);
		this.onTimeout(150, ()=> this.args.menu.args.active = `active`);
	}

	deactivateMenu()
	{
		this.args.menu.deactivate();
	}
}
