export * as $colors from 'https://deno.land/std@0.106.0/fmt/colors.ts';
export * as $path from 'https://deno.land/std@0.106.0/path/mod.ts';

// * `std/fs` contains unstable code => import only needed stable portions
import { exists, existsSync } from 'https://deno.land/std@0.106.0/fs/exists.ts';
export const $fs = { exists, existsSync };
