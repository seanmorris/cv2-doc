import { Config } from 'Config';

import { View as BaseView } from 'curvature/base/View';

export class Head extends BaseView
{
	static get()
	{
		return this.instance = this.instance || new this;
	}

	constructor(args = {})
	{
		super(args);

		args.title = args.title || Config.title;
		args.description = args.description || '';

		args.bindTo('title', (v) => document.title = v);

		this.template = require('./head.tmp');
	}
}
