export class RemoteFile
{
	constructor(url, options = {encoding: 'utf-8', fetch: {}})
	{
		this.url   = url;
		this.chunk = null;
		this.index = 0;
		this.done  = false;

		this.fetchInit = options.fetch;
		this.encoding  = options.encoding;
		this.length    = -1;
	}

	readChunk()
	{
		if(this.done)
		{
			return Promise.resolve(new Uint8Array());
		}

		if(this.chunk && this.index < this.chunk.length)
		{
			return Promise.resolve(this.chunk);
		}

		if(!this.reader)
		{
			this.reader = fetch(this.url, this.fetchInit).then(
				response => {

					const length = response.headers.get("content-length")

					this.length = length;

					if(!isNaN(length) && length == Number(length))
					{
						this.length = Number(length);
					}

					return response.body.getReader();
				}
			);
		}

		return this.reader.then(r => r.read(8)).then(({done,value}) => {

			this.chunk = value;
			this.done  = done;

			if(!done)
			{
				this.index = 0;
			}

			if(done)
			{
				return new Uint8Array(0);
			}

			return value;

		});
	}

	readBytes(total = 1024)
	{
		let found  = 0;

		const buffer = new Uint8Array(total);

		const getBytes = () => {

			return this.readChunk().then(chunk => {

				const start = this.index;
				let   end   = this.index + chunk.length;

				if(end > buffer.length)
				{
					end = this.index + (buffer.length - found);
				}

				const slice = chunk.slice(start, end);

				buffer.set(slice, found);

				this.index += slice.length;
				found      += slice.length;

				if(!this.done && total > found)
				{
					return getBytes();
				}

				return buffer.slice(0, found);
			});
		};

		return getBytes();
	}

	readLine()
	{
		const newline = /\n/;

		let found  = 0;

		const buffer = [];

		const getBytes = () => {
			return this.readChunk().then(chunk => {

				let terminated = false;

				const start = this.index;
				let   end   = this.index + chunk.length;

				for(let i = start; i < end; i++)
				{
					if(chunk[i] === 10 || chunk[i] === 13)
					{
						end = i + 1;

						while(chunk[end] === 13)
						{
							end++;
						}

						terminated = true;

						break;
					}
				}

				const slice = chunk.slice(start, end);

				buffer.splice(found, 0, ...slice);

				this.index += slice.length;
				found      += slice.length;

				if(!this.done && !terminated)
				{
					return getBytes();
				}

				return new Uint8Array(buffer.slice(0, found));
			});
		};

		return getBytes().then(bytes => {

			if(!this.decoder)
			{
				this.decoder = new TextDecoder(this.encoding);
			}

			return this.decoder.decode(bytes);

		});
	}

	readLines(callback, accumulator = {})
	{
		if(callback === undefined)
		{
			callback = amount;
		}

		return this.readLine().then(line => {

			callback(line, accumulator);

			if(!this.done)
			{
				return this.readLines(callback, accumulator);
			}

			return Promise.resolve(accumulator);
		});
	}
}
