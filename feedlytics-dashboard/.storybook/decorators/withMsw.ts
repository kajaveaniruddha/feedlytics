/**
 * Thin re-export of `msw-storybook-addon`'s loader. Imported once in
 * `preview.tsx` so every story that declares `parameters.msw.handlers`
 * automatically gets a fresh MSW worker before the story mounts.
 */
export { mswLoader as withMswLoader } from "msw-storybook-addon";
