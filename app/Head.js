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
	}

	postRender()
	{
		const tag  = document.head;
		const args = this.args;

		args.bindTo('title', v => {
			const meta = this.getTag('meta', {name:'title'});
			const og   = this.getTag('meta', {property:'og:title'});

			meta.setAttribute('content', v);
			og.setAttribute('content', v);

			document.title = v;
		});

		args.bindTo('description', v => {
			const meta = this.getTag('meta', {name:'description'});
			const og   = this.getTag('meta', {property:'og:description'});

			meta.setAttribute('content', v);
			og.setAttribute('content', v);
		});

		args.bindTo('status', v => {
			const prender = this.getTag('meta', {name:'prerender-status-code'});
			const http    = this.getTag('meta', {'http-equiv':'Status'});

			prender.setAttribute('content', v);
			http.setAttribute('content', v);
		});

		this.template = require('./head.tmp');

		this.tags = {};
	}

	getTag(name, attributes = {})
	{
		const keys = Object.keys(attributes).sort();
		const attr = keys.map(k=>`[${k}='${attributes[k]}']`)

		const selector = name + attr;

		if(this.tags[selector])
		{
			return this.tags[selector];
		}

		const existing = document.querySelector(selector);

		if(existing)
		{
			return existing;
		}

		const newTag = this.tags[selector] = document.createElement(name);

		document.head.append(newTag);

		keys.map(k => newTag.setAttribute(k, attributes[k]));

		return newTag;
	}
}
