import { Repository } from 'curvature/base/Repository';

import { View as BaseView } from 'curvature/base/View';
import { View as ClassPage } from '../classpage/View';

import { Loader } from './Loader';
import { Home } from './Home';


export class View extends BaseView
{
	constructor(args)
	{
		super(args);

		this.template = require('./view.tmp');

		this.args.menu = this.args.menu || '';
		this.args.content = '';

		const docs = this.args.docs;

		this.templates = {};

		this.routes = {

			'': (args) => {

				console.log('home', args);

				return new Home;
			}

			, 'readme': () => {

				if(this.templates['readme'])
				{
					const view = new View;

					view.template = this.templates['readme'];
					
					return view;
				}

				this.args.content = new Loader;

				return Repository.request(
					'https://api.github.com/repos/seanmorris/ids/contents/README.md'
					, {}, false, true, {
						withCredentials: false
						, responseType: 'text'
						, headers: {
							'Accept':   'application/vnd.github.v3.html+json'
						}
					}
				).then(response => {

					const view = new View;

					view.template = response.response;

					this.templates['readme'] = response.response;

					return view;
				});
			}

			, 'license': () => {

				if(this.templates['license'])
				{
					const view = new View;

					view.template = this.templates['license'];
					
					return view;
				}

				this.args.content = new Loader;

				return Repository.request(
					'https://api.github.com/repos/seanmorris/ids/contents/LICENSE'
					, {}, false, true, {
						withCredentials: false
						, responseType: 'text'
						, headers: {
							'Accept':   'application/vnd.github.v3.html+json'
						}
					}
				).then(response => {

					const view = new View;

					view.template = response.response;

					this.templates['license'] = response.response;

					return view;
				});
			}


			, 'class/*': (args) => {

				const classname = decodeURIComponent(args.pathparts.join('\\'));

				let content = '';


				if(docs[classname])
				{
					const dump = JSON.stringify(docs[classname], null, 4);
					
					content = new ClassPage(
						Object.assign({}, docs[classname], {dump})
					);
				}

				const contentTag = this.findTag('.main-content');

				contentTag && contentTag.scrollTo({top:0});

				document.activeElement.blur();

				return content;
			}

			, false: (args) => {

				console.log(404, args, location.pathname);

				return '404!!!';

			}
		};
	}
}
