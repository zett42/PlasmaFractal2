/*
Option descriptor classes. Copyright (c) 2019 zett42.
https://github.com/zett42/PlasmaFractal2

MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE. 
*/

import * as z42opt    from "./optionsDescriptor.module.js"
import * as z42optVal from "./optionsDescriptorValues.module.js"
import * as z42easing from "./easing.module.js"

// Additional dependencies (include via <script> tag):
// 'easing.js' (zett42 version)

//------------------------------------------------------------------------------------------------

class PaletteOpt extends z42opt.Option {
	constructor( attrs ){
		super( attrs );

		// Assign default descriptors for palette item data
		if( ! attrs.posDesc ) {
			this.$attrs.posDesc = new z42optVal.FloatOpt({ 
				min: 0, max: 1, maxDecimals: 3,
				defaultVal: 0
			});
		}
		if( ! attrs.colorDesc ) {
			this.$attrs.colorDesc = new z42optVal.ColorOpt({
				defaultVal: { r: 0, g: 0, b: 0 }
			});
		}
		if( ! attrs.easeDesc ) {
			this.$attrs.easeDesc  = new z42optVal.EnumOpt({	
				values: this.$attrs.easeFunctions,
				defaultVal: this.$attrs.defaultEaseFunction
			});
		}
	}

	$serialize( value ) {
		let result = "";

		for( const item of value ){
			if( result.length > 0 )
				result += " ";
			result += this.$attrs.posDesc.$serialize( item.pos ) + "_";
			result += this.$attrs.colorDesc.$serialize( item.color ) + "_";
			result += this.$attrs.easeDesc.$serialize( item.easeFun );
		}

		return result;
	}

	$deserialize( value ) {
		let result = [];

		for( const itemStr of value.split( " " ) ){
			let item = {};
			const itemValues = itemStr.split( "_" );
			if( itemValues.length < 2 )
				continue;
			item.pos = Number( itemValues[ 0 ] );
			item.color = this.$attrs.colorDesc.$deserialize( itemValues[ 1 ] );
			if( itemValues.length >= 3 )
				item.easeFun = this.$attrs.easeDesc.$deserialize( itemValues[ 2 ] );
			else
				item.easeFun = this.$attrs.defaultEaseFunction;
			
			result.push( item );
		}

		return result;			
	}

	// Resolve ease function name to actual function.
	$resolveEaseFunction( functionName ) {
		return z42easing[ functionName ] || z42easing.linear;
	}

	// Return a cloned palette with ease function names resolved to actual functions.
	$resolvePaletteEaseFunctions( palette ) {
		return palette.map( item => ({ 
			pos     : item.pos, 
			color   : { ...item.color },
			easeFun : this.$resolveEaseFunction( item.easeFun )
		}));				
	}

	get $defaultComponent() { return "z42opt-palette"; }
}	

//------------------------------------------------------------------------------------------------

export { Node, Option } from "./optionsDescriptor.module.js"

export { 
	PaletteOpt,
}