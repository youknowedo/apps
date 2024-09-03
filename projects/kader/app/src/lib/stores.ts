import type { User } from '@kader/shared';
import type QrScanner from 'qr-scanner';
import { writable } from 'svelte/store';

export const user = writable<User | null | undefined>(undefined);

export const offline = writable(false);

export const qrScanner = writable<QrScanner | null>(null);
