import { View as BaseView } from 'curvature/base/View';

import { Loader } from './Loader';

export class Info extends BaseView
{
	constructor(args)
	{
		super(args);

		this.template = require('./info.tmp');

		this.args.loader = new Loader;

		this.onTimeout(750, ()=>this.args.loader = '');
	}
}