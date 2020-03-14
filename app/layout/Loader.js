import { View as BaseView } from 'curvature/base/View';

export class Loader extends BaseView
{
	constructor(args)
	{
		super(args);

		this.template = '<div class = "loader" src = "/spin.svg"></div>'
	}
}