export type NameContext = 'solo' | 'with-others';

export function renderName(context: NameContext = 'solo'): string {
	return context === 'solo' ? 'mark orloff' : 'Mark Orloff';
}


