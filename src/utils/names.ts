import { copy } from "../lib/site-copy.mjs";
export type NameContext = 'solo' | 'with-others';

export function renderName(context: NameContext = 'solo'): string {
	return context === 'solo' ? copy("ui.nav.mark-orloff") : copy("ui.footer.mark-orloff");
}


