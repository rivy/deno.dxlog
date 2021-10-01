// tests ~ dependencies

export * from '../src/lib/$deps.ts';

// assert functions (with assertion signatures) always require explicit type annotation
// * ref: <https://github.com/microsoft/TypeScript/issues/36931> , <https://github.com/microsoft/TypeScript/issues/36067>
// eg...
//  import * as $asserts from 'https://deno.land/std@0.106.0/testing/asserts.ts';
//  export const assert: typeof $asserts.assert = Asserts.assert;
// or use more direct exports...
//  export { assert, assertEquals, equal } from 'https://deno.land/std@0.106.0/testing/asserts.ts';
export * as $asserts from 'https://deno.land/std@0.106.0/testing/asserts.ts';
export {
	assert,
	assertEquals,
	assertNotEquals,
	assertStringIncludes,
	assertThrows,
	assertThrowsAsync,
	equal,
} from 'https://deno.land/std@0.106.0/testing/asserts.ts';

export * as $args from 'https://deno.land/x/dxx@v0.0.9/src/lib/xArgs.ts';
