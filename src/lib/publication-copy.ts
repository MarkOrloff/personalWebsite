import {copy} from './site-copy.mjs';
import type {CollectionEntry} from 'astro:content';
// Route identifiers and bibliographic links remain stable when the prose changes.
export function withPublicationCopy(entry:CollectionEntry<'publications'>) {
 const slug=entry.data.walkthrough!.split('/').at(-1)!;
 const key=`publication.${slug}`;
 return {...entry,data:{...entry.data,title:copy(`${key}.title`),venue:copy(`${key}.venue`),summary:copy(`${key}.summary`),figureAlt:copy(`${key}.figureAlt`),authors:copy(`${key}.authors`).split('|').map(name=>name.trim())}};
}
