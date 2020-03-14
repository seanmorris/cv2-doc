import { View as BaseView } from 'curvature/base/View';

import { Loader } from './Loader';

export class Home extends BaseView
{
	constructor(args)
	{
		super(args);

		this.template = require('./home.tmp');

		this.args.loader = new Loader;

		this.onTimeout(750, ()=>this.args.loader = '');
	}
}