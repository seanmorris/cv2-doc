import { RemoteFile } from './RemoteFile';

export class Rak
{
	constructor(options)
	{
		this.url    = options.url || false;
		this.remote = null;
		this.mode   = this.constructor.ERROR_MODE;
		this.escape = false;
		this.key    = undefined;
		this.header = undefined;
		this.source = undefined;

		this.headerParsed = undefined;
	}

	read()
	{
		if(!this.remote)
		{
			this.remote = new RemoteFile(this.url);
		}

		this.mode = this.constructor.KEY_MODE;

		this.remote.readLine();

		this.remote.readBytes(1).then(([byte])=>{

			const char = String.fromCharCode(byte);

			if(!this.escape && char === ';')
			{
				this.mode++;
			}

			if(char === '\\')
			{
				this.escape = true;
			}

			this.escape = false;
		});
	}
}

[
	'ERROR_MODE',    'KEY_MODE'
	, 'HEADER_MODE', 'HEADER_DONE_MODE'
	, 'VALUE_MODE',  'VALUE_DONE_MODE'
].map((constName, constValue)=>{
	Object.assign(Rak, constName, {
		configurable: false
		, writable:   false
		, value:      constValue
	});
})

/**
Simpler Grammar:

value
	100
	"string"
	["list"]
	{"object":"json"}

value
;value
key;;value
key;header;header;;value

**/

/* rak grammar:

key    = [a-z][0-9a-z]+?
string = "[.]+?"
number = [0-9]+?
null   = null
object = {.+?}|[.+?] (literal square brackets)
value  = [<string>|<number>|<null>|<object>]

<key>:<value>\n
:<value>\n
"<string>"\n
<number>\n

if the first character is [0-9a-z]

*/
