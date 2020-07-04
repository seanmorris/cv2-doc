import { View as BaseView } from 'curvature/base/View';

export class View extends BaseView
{
	constructor(args)
	{
		super(args);

		this.args.modals = this.args.modals || [];

		this.template = require('./view.tmp');
	}

	static get()
	{
		return this.instance = this.instance || new this;
	}
}
