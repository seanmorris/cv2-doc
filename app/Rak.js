import { RemoteFile } from './RemoteFile';

export class Rak
{
	constructor(options)
	{
		this.url    = options.url || false;
		this.delim  = "\n";
		this.remote = null;
	}

	read()
	{
		if(!this.remote)
		{
			this.remote = new RemoteFile(this.url);
		}

		this.remote.readBytes(1).then(([byte])=>{

			switch(byte)
			{
				case 0x3A: // ':'
			}

		});
	}
}

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
