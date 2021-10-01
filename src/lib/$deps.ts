export * as Colors from 'https://deno.land/std@0.106.0/fmt/colors.ts';
export * as Path from 'https://deno.land/std@0.106.0/path/mod.ts';

// * `std/fs` contains unstable code => import only needed stable portions
import { exists, existsSync } from 'https://deno.land/std@0.106.0/fs/exists.ts';
export const FS = { exists, existsSync };

// assert functions (with assertion signatures) always require explicit type annotation
// * ref: <https://github.com/microsoft/TypeScript/issues/36931> , <https://github.com/microsoft/TypeScript/issues/36067>
// eg...
//  import * as Asserts from 'https://deno.land/std@0.106.0/testing/asserts.ts';
//  export const assert: typeof Asserts.assert = Asserts.assert;
// or use more direct exports...
//  export { assert, assertEquals, equal } from 'https://deno.land/std@0.106.0/testing/asserts.ts';
export * as Asserts from 'https://deno.land/std@0.106.0/testing/asserts.ts';
export { assert, assertEquals, equal } from 'https://deno.land/std@0.106.0/testing/asserts.ts';

// export { decode, encode } from 'https://deno.land/std@0.85.0/encoding/utf8.ts'; // 'utf8.ts' was removed via commit 5bc18f5d86
export const decoder = new TextDecoder();
export const encoder = new TextEncoder();
export const decode = (input?: Uint8Array): string => decoder.decode(input);
export const encode = (input?: string): Uint8Array => encoder.encode(input);
