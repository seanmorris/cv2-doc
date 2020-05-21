import { Config } from 'Config';
import { View as BaseView } from 'curvature/base/View';

import { Loader } from './Loader';

export class Home extends BaseView
{
	constructor(args)
	{
		super(args);

		this.template = require('./home.tmp');

		this.args.loader = new Loader;

		this.args.links   = Config.homeLinks;
		this.args.tagline = Config.tagline;
		this.args.author  = Config.author;
		this.args.project = Config.project;
		
		this.args.copyright  = Config.copyright;

		this.onTimeout(750, ()=>this.args.loader = '');
	}
}