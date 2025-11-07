import { defineCollection, z } from 'astro:content';

const publications = defineCollection({
	schema: z.object({
		title: z.string(),
		authors: z.array(z.string()).default([]),
		venue: z.string().optional(),
		year: z.number().int().optional(),
		doi: z.string().optional(),
		url: z.string().url().optional(),
		type: z.enum(['article','commentary']).optional(),
		tags: z.array(z.string()).default([]),
		status: z.enum(['published','in-review','preprint']).optional(),
		summary: z.string().optional(),
		figure: z.string().optional(), // e.g., "/pubs/2024-orloff-et-al.jpg"
		figureAlt: z.string().optional(),
	}),
});

const projects = defineCollection({
	schema: z.object({
		title: z.string(),
		summary: z.string().optional(),
		year: z.number().int().optional(),
		thumb: z.string().optional(),
		links: z.object({ code: z.string().url().optional(), demo: z.string().url().optional(), paper: z.string().url().optional() }).optional(),
		tags: z.array(z.string()).default([]),
	}),
});

export const collections = { publications, projects };


