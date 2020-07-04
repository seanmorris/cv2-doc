import { View as BaseView } from 'curvature/base/View';

export class Modal extends BaseView
{
	constructor(args)
	{
		super(args);

		this.args.modals = this.args.modals || [];

		this.template = require('./modal.tmp');
	}
}
