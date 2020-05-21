import { Config } from 'Config';
import { Router } from 'curvature/base/Router';

import { View as BaseView } from 'curvature/base/View';

export class View extends BaseView
{
	constructor(args)
	{
		super(args);

		this.template = require('./view.tmp');

		const classname = this.args.classname;

		this.args.sourceRoot = Config.sourceRoot;

		this.args.bindTo('classname', (v) => {
			this.args.encodedName = encodeURIComponent(v);
		});

		this.args.bindTo('parent', (v) => {
			this.args.encodedParent = encodeURIComponent(v);
		});

		this.args.lines = {};

		this.args.bindTo('lines', (v) => {
			if(!v)
			{
				return;
			}
			Object.assign(this.args.lines, v);
		});

		this.args.notes = {};

		this.args.rawTags = '';

		this.args.expanded = {};

		this.args.bindTo('doc', (v) => {
			if(!v) { v = '' }
			Object.assign(this.args.notes, this.processDocComment(v));
			this.args.rawTags = JSON.stringify(this.args.notes.tags, null, 4);
			
		});

		this.args.methodCount = 0;

		this.args.bindTo('methods', (v) => {

			if(!v)
			{
				return;
			}
			
			this.args.methodCount = Object.keys(v).length;

			for(const m in v)
			{
				const method = v[m];

				method.icon = this.getVisibilityIcon(method);
				method.scopeIcon = this.getScopeIcon(method);
				method.refIcon = this.getRefIcon(method);

				method.parameterCount = Object.keys(method.parameters).length

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
		});

		this.args.propertyCount = 0;

		this.args.bindTo('properties', (v) => {

			if(!v)
			{
				return;
			}
			
			this.args.propertyCount = Object.keys(v).length;
			
			for(const p in v)
			{
				const property = v[p];

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
		});

		this.args.constantCount = 0;

		this.args.bindTo('constants', (v) => {

			if(!v)
			{
				return;
			}

			this.args.constantCount = Object.keys(v).length;

			for(const c in v)
			{
				const constant = v[c];

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
		});

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

	arLen(x)
	{
		if(!x)
		{
			return 0;
		}

		return x.length
			|| Object.keys(x).length
			|| 0;
	}
}
