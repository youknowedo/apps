/// <reference types="@sveltejs/kit" />
/// <reference lib="webworker" />

import { build, files, prerendered, version } from '$service-worker';
import { precacheAndRoute } from 'workbox-precaching';

const precache_list = ['./', './profile', './explore', ...build, ...files, ...prerendered].map(
	(s) => ({
		url: s,
		revision: version
	})
);

if (process.env.NODE_ENV === 'production') precacheAndRoute(precache_list);
