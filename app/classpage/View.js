import { Router } from 'curvature/base/Router';

import { View as BaseView } from 'curvature/base/View';

export class View extends BaseView
{
	constructor(args)
	{
		super(args);

		this.template = require('./view.tmp');

		const classname = args.classname;

		args.encodedName = encodeURIComponent(classname);
		args.encodedParent = encodeURIComponent(args.parent);

		args.notes = {};

		args.rawTags = '';

		args.expanded = {};

		if(args.doc)
		{
			args.notes = this.processDocComment(args.doc);
			args.rawTags = JSON.stringify(args.notes.tags, null, 4);
		}

		for(const m in args.methods)
		{
			const method = args.methods[m];

			method.icon = this.getVisibilityIcon(method);
			method.scopeIcon = this.getScopeIcon(method);
			method.refIcon = this.getRefIcon(method);

			for(const p in method.parameters)
			{
				const param = method.parameters[p];

				param.defaultString = '';

				if(param.hasDefault)
				{
					param.defaultString = JSON.stringify(param.default, null, 4);
				}
			}

			method.rawTags = '';

			if(method.doc)
			{
				method.notes = this.processDocComment(method.doc);
				method.rawTags = JSON.stringify(method.notes.tags, null, 4);
			}

			method.inherited = false;

			method.overriden = !!method.overrides;

			if(classname !== method.class)
			{
				method.encodedClass = encodeURIComponent(method.class);
				method.inherited = true;
			}
		}

		for(const p in args.properties)
		{
			const property = args.properties[p];

			property.icon = this.getVisibilityIcon(property);

			property.scopeIcon = this.getScopeIcon(property);

			property.defaultString = '';

			if(property.default !== null)
			{
				property.defaultString = JSON.stringify(property.default, null, 4);
			}

			property.inherited = false;

			if(classname !== property.class)
			{
				property.encodedClass = encodeURIComponent(property.class);
				property.inherited = true;
			}
		}

		for(const c in args.constants)
		{
			const constant = args.constants[c];

			constant.icon = this.getVisibilityIcon(constant);

			constant.valuedString = '';

			if(constant.value !== null)
			{
				constant.valueString = JSON.stringify(constant.value, null, 4);
			}

			constant.inherited = false;

			constant.class = constant.class ? constant.class.name : '';

			if(constant.file && classname !== constant.class)
			{
				constant.encodedClass = encodeURIComponent(constant.class);
				constant.inherited = true;
			}
		}

		this.args.classes = {};

		this.args.classes.bindTo((v,k) => {

			this.args.classList = Object
				.values(this.args.classes)
				.filter(x=>x)
				.join(' ');

		}, {wait: 0});
	}

	processDocComment(string)
	{
		const raw = string.replace(/\n\s+\*\/?/g, "\n")
			.replace(/\/\*\*\s+/g, '')
			.replace(/\*\/$/g, '')
			.trim();

		const lines = raw.split(/\n/).map(l=>l.trim());

		if(!lines)
		{
			return;
		}

		let summaryLine;

		const summaryLines = [];

		while(summaryLine = lines.shift())
		{
			summaryLines.push(summaryLine);
		}

		const summary   = summaryLines.join("\n");
		const bodyLines = [];
		const tagLines  = [];

		for(const line of lines)
		{

			if(line.match(/^@/))
			{
				tagLines.push(line);
				continue;
			}

			if(tagLines.length)
			{
				continue;
			}

			bodyLines.push(line);
		}

		for(const tag in tagLines)
		{

		}

		console.log(bodyLines);

		const body = bodyLines.join("\n");
		const tags = tagLines;

		return {summary, body, tags}
	}

	getRefIcon(obj)
	{
		if(obj.reference)
		{
			return '/link.svg';
		}
	}

	getScopeIcon(obj)
	{
		if(obj.static)
		{
			return '/connected.svg';
		}
	}

	getVisibilityIcon(obj)
	{
		if(obj.public)
		{
			return '/open-box.svg';
		}

		if(obj.protected)
		{
			return '/closed-box.svg';
		}

		if(obj.private)
		{
			return '/lock.svg';
		}
	}

	expand(event, section)
	{
		event.preventDefault();

		this.args.expanded[section] = !!!this.args.expanded[section];

		const expand =`expand-${section}`;
		const collapse = `collapse-${section}`;

		if(this.args.expanded[section])
		{
			this.args.classes[expand] = expand;
			this.args.classes[collapse] = '';
		}
		else
		{
			this.args.classes[expand] = '';
			this.args.classes[collapse] = collapse;
		}
	}

	encodeURI(x)
	{
		return encodeURIComponent(x);
	}
}
