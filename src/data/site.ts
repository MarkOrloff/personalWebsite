import { copy } from "../lib/site-copy.mjs";
export const SITE = {
	title: copy("ui.nav.mark-orloff"),
	description: copy("ui.site.i-study-how-people-decide-what"),
	domain: 'markorloff.com',
	author: { name: copy("ui.nav.mark-orloff"), email: 'maorloff@ucla.edu' },
	social: {
		googleScholar: 'https://scholar.google.com/citations?user=wbCliVMAAAAJ&hl=en',
		x: 'https://x.com/orloffma',
		github: 'https://github.com/markorloff',
		orcid: 'https://orcid.org/0000-0002-6958-5479',
	},
} as const;

