import { da } from './da';
import { en, type Dict } from './en';
import type { Lang } from './site';

export const dictionaries: Record<Lang, Dict> = { en, da };

export type { Dict };
