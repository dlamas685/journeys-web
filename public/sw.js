if (!self.define) {
	let e,
		a = {}
	const i = (i, s) => (
		(i = new URL(i + '.js', s).href),
		a[i] ||
			new Promise(a => {
				if ('document' in self) {
					const e = document.createElement('script')
					;(e.src = i), (e.onload = a), document.head.appendChild(e)
				} else (e = i), importScripts(i), a()
			}).then(() => {
				let e = a[i]
				if (!e) throw new Error(`Module ${i} didn’t register its module`)
				return e
			})
	)
	self.define = (s, n) => {
		const f =
			e ||
			('document' in self ? document.currentScript.src : '') ||
			location.href
		if (a[f]) return
		let c = {}
		const t = e => i(e, f),
			d = { module: { uri: f }, exports: c, require: t }
		a[f] = Promise.all(s.map(e => d[e] || t(e))).then(e => (n(...e), c))
	}
}
define(['./workbox-4754cb34'], function (e) {
	'use strict'
	importScripts(),
		self.skipWaiting(),
		e.clientsClaim(),
		e.precacheAndRoute(
			[
				{
					url: '/_next/app-build-manifest.json',
					revision: '9fff08bc020991d11df10d29040b0ed9',
				},
				{
					url: '/_next/static/chunks/23-24257995369a78fb.js',
					revision: 'nD8WegpbRvz-3mfReioHY',
				},
				{
					url: '/_next/static/chunks/app/_not-found/page-bf3dcdfc543df4f5.js',
					revision: 'nD8WegpbRvz-3mfReioHY',
				},
				{
					url: '/_next/static/chunks/app/layout-bf522c444d8d459c.js',
					revision: 'nD8WegpbRvz-3mfReioHY',
				},
				{
					url: '/_next/static/chunks/app/page-ffc06cd4473239c6.js',
					revision: 'nD8WegpbRvz-3mfReioHY',
				},
				{
					url: '/_next/static/chunks/fd9d1056-121e52b18ff0a3a9.js',
					revision: 'nD8WegpbRvz-3mfReioHY',
				},
				{
					url: '/_next/static/chunks/framework-f66176bb897dc684.js',
					revision: 'nD8WegpbRvz-3mfReioHY',
				},
				{
					url: '/_next/static/chunks/main-6853e84cf0e5922d.js',
					revision: 'nD8WegpbRvz-3mfReioHY',
				},
				{
					url: '/_next/static/chunks/main-app-19b5826e59a91c3b.js',
					revision: 'nD8WegpbRvz-3mfReioHY',
				},
				{
					url: '/_next/static/chunks/pages/_app-6a626577ffa902a4.js',
					revision: 'nD8WegpbRvz-3mfReioHY',
				},
				{
					url: '/_next/static/chunks/pages/_error-1be831200e60c5c0.js',
					revision: 'nD8WegpbRvz-3mfReioHY',
				},
				{
					url: '/_next/static/chunks/polyfills-78c92fac7aa8fdd8.js',
					revision: '79330112775102f91e1010318bae2bd3',
				},
				{
					url: '/_next/static/chunks/webpack-7f1fd46409e2859f.js',
					revision: 'nD8WegpbRvz-3mfReioHY',
				},
				{
					url: '/_next/static/css/3d81dfd836bc7960.css',
					revision: '3d81dfd836bc7960',
				},
				{
					url: '/_next/static/media/0f988d53b2f1424c-s.woff2',
					revision: 'd3fbcb1c7ee95e9f29a4d16398f3842f',
				},
				{
					url: '/_next/static/media/118bf6d367285d36-s.woff2',
					revision: 'f2425e218d91fc6979786f4b267b7b25',
				},
				{
					url: '/_next/static/media/194e68b1ff4d40ee-s.woff2',
					revision: '4669e81d91999fb5beb09b0db0580f94',
				},
				{
					url: '/_next/static/media/21633f890e359fee-s.woff2',
					revision: 'cb99b126275a25f969a1a17428869eb4',
				},
				{
					url: '/_next/static/media/25a5e0a85b5534ab-s.woff2',
					revision: 'dc49f3d40c512b2e7cdb1f1552280f80',
				},
				{
					url: '/_next/static/media/293d9d85a89f760b-s.woff2',
					revision: '5568baada3de241152dfdcfc15bfdbf0',
				},
				{
					url: '/_next/static/media/3968760fd8ece0a3-s.woff2',
					revision: 'e147adbea2297cb91f733d7d90ad33ec',
				},
				{
					url: '/_next/static/media/3a8dc5763a8ae4b2-s.p.woff2',
					revision: '3d5fc7758046950deb331db2ea1bb354',
				},
				{
					url: '/_next/static/media/3d1b4cd72392c668-s.woff2',
					revision: 'b36ecaa993a5a6e8a44da51d63216499',
				},
				{
					url: '/_next/static/media/47124bda5734331b-s.woff2',
					revision: '4adc53ec8dfdf1f18642002fda777b38',
				},
				{
					url: '/_next/static/media/4c6c315ad7ef160c-s.woff2',
					revision: '4eda3970e3975fa7b77a4b3d7d54c39a',
				},
				{
					url: '/_next/static/media/6437c9a719d2631a-s.woff2',
					revision: 'cf283d99fcf31cd9ecb8b4bb81fe8e58',
				},
				{
					url: '/_next/static/media/70186eb99643df05-s.p.woff2',
					revision: 'e370fb80ed3ab65eee1e45bc1175e62f',
				},
				{
					url: '/_next/static/media/79f211352bb2b76c-s.woff2',
					revision: 'e3ca80a92df649d2f59cf69255ddcde2',
				},
				{
					url: '/_next/static/media/8976b37f8037a4c0-s.woff2',
					revision: '981e5326f318811beab9171f2af3255c',
				},
				{
					url: '/_next/static/media/92b4e3874e08ad07-s.p.woff2',
					revision: 'f0775349168ec5a0d0df4706408fda14',
				},
				{
					url: '/_next/static/media/9a36a762d2852da3-s.p.woff2',
					revision: '30f55039e8a991359dfea3816a50acb8',
				},
				{
					url: '/_next/static/media/9c526da3fdc4ac93-s.woff2',
					revision: '720060411c9cc14a53c5ec1e514d7e7c',
				},
				{
					url: '/_next/static/media/ada9171bd6839183-s.woff2',
					revision: '9e6ef6d2be89be13d2ce186ef7fccc46',
				},
				{
					url: '/_next/static/media/aefa312f0ff0f860-s.woff2',
					revision: 'd4faf263c15f5f09975d5c0ced734320',
				},
				{
					url: '/_next/static/media/b94157c21e18e701-s.woff2',
					revision: '14faf047a69583cc240bc7d1b8aac1cb',
				},
				{
					url: '/_next/static/media/c46b718c72db4bb2-s.p.woff2',
					revision: '794fb6b0e62bff6eef7f6f35f0d99c71',
				},
				{
					url: '/_next/static/media/cc3a83d75f4fa91b-s.woff2',
					revision: 'aec893e0d78d5210610077ff58295529',
				},
				{
					url: '/_next/static/media/d243484f45a39d20-s.p.woff2',
					revision: '0e8304aa709f8a44b4f121d07c22a086',
				},
				{
					url: '/_next/static/media/d364c42434837330-s.woff2',
					revision: '998b1320fd70ef6ded72784a7f86e2b2',
				},
				{
					url: '/_next/static/media/daeff688de1e2f86-s.woff2',
					revision: '826714b4429682d7019519195ed1812c',
				},
				{
					url: '/_next/static/media/e9ed9197b1d41e00-s.p.woff2',
					revision: '20c36042027fb7fddcd4ba3d5924f65b',
				},
				{
					url: '/_next/static/media/ec4a340d7d92ca39-s.woff2',
					revision: '3b542c7620fe7f86661f8e863ff1e4da',
				},
				{
					url: '/_next/static/media/f2829b631bf8ff02-s.woff2',
					revision: '08ec6d76e1966a129e4939528e0f944b',
				},
				{
					url: '/_next/static/nD8WegpbRvz-3mfReioHY/_buildManifest.js',
					revision: '2ec694eb52ae4f523f265a46bae4d768',
				},
				{
					url: '/_next/static/nD8WegpbRvz-3mfReioHY/_ssgManifest.js',
					revision: 'b6652df95db52feb4daf4eca35380933',
				},
				{
					url: '/brand/base-v1.png',
					revision: '0cb04e4bbea6e1e5aecffe7ebdac7761',
				},
				{
					url: '/brand/base-v2.png',
					revision: '29e3abbc1bdba357a8f54e671fa03cbf',
				},
				{
					url: '/brand/base-v3.png',
					revision: '6ea07bc20d309788504c20c8eb075fac',
				},
				{
					url: '/brand/imagotype-v1.png',
					revision: '6fec670e58cc91736d7648a15ca91f42',
				},
				{
					url: '/brand/imagotype-v2.png',
					revision: 'f5625fbe84d8996d10241881f7eafb4b',
				},
				{
					url: '/brand/imagotype-v3.png',
					revision: '12d54c4b9b94057410ae7f7f94671350',
				},
				{
					url: '/brand/isotype-v1.png',
					revision: '65d854f67ae088991144c8383958eb91',
				},
				{
					url: '/brand/isotype-v2.png',
					revision: 'f5a50e3de5b5de2857fbb0f383d7316e',
				},
				{
					url: '/brand/isotype-v3.png',
					revision: '3884f99c9e2cca59b6e20e67b409925c',
				},
				{
					url: '/brand/logotype-v1.png',
					revision: '65f723e8f4edac4c40b6a8cf3167dfc2',
				},
				{
					url: '/brand/logotype-v2.png',
					revision: '65f723e8f4edac4c40b6a8cf3167dfc2',
				},
				{
					url: '/brand/logotype-v3.png',
					revision: '65f723e8f4edac4c40b6a8cf3167dfc2',
				},
				{ url: '/brand/v1.png', revision: '39ef3e8e945db97e1844c8d5891afaca' },
				{ url: '/brand/v2.png', revision: '56adffe3ed42ec79ef0d6fa6aba0f8a2' },
				{ url: '/brand/v3.png', revision: '563724d855544b3a86c6f1d4fd532bfe' },
				{
					url: '/icons/icon-192x192.png',
					revision: '1ff13be4512d2b66ff331ea7a3acb8df',
				},
				{
					url: '/icons/icon-256x256.png',
					revision: '6bb7b8195018ad44dd47c523e5c07115',
				},
				{
					url: '/icons/icon-384x384.png',
					revision: '49c491e8397903b88963aee31fe31855',
				},
				{
					url: '/icons/icon-512x512.png',
					revision: 'b7199482e871d8527f58845403b241bb',
				},
				{ url: '/manifest.json', revision: '7eeb48df336fc513695bc54c889505c1' },
			],
			{ ignoreURLParametersMatching: [] }
		),
		e.cleanupOutdatedCaches(),
		e.registerRoute(
			'/',
			new e.NetworkFirst({
				cacheName: 'start-url',
				plugins: [
					{
						cacheWillUpdate: async ({
							request: e,
							response: a,
							event: i,
							state: s,
						}) =>
							a && 'opaqueredirect' === a.type
								? new Response(a.body, {
										status: 200,
										statusText: 'OK',
										headers: a.headers,
									})
								: a,
					},
				],
			}),
			'GET'
		),
		e.registerRoute(
			/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
			new e.CacheFirst({
				cacheName: 'google-fonts-webfonts',
				plugins: [
					new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 }),
				],
			}),
			'GET'
		),
		e.registerRoute(
			/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
			new e.StaleWhileRevalidate({
				cacheName: 'google-fonts-stylesheets',
				plugins: [
					new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
				],
			}),
			'GET'
		),
		e.registerRoute(
			/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
			new e.StaleWhileRevalidate({
				cacheName: 'static-font-assets',
				plugins: [
					new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
				],
			}),
			'GET'
		),
		e.registerRoute(
			/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
			new e.StaleWhileRevalidate({
				cacheName: 'static-image-assets',
				plugins: [
					new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
				],
			}),
			'GET'
		),
		e.registerRoute(
			/\/_next\/image\?url=.+$/i,
			new e.StaleWhileRevalidate({
				cacheName: 'next-image',
				plugins: [
					new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
				],
			}),
			'GET'
		),
		e.registerRoute(
			/\.(?:mp3|wav|ogg)$/i,
			new e.CacheFirst({
				cacheName: 'static-audio-assets',
				plugins: [
					new e.RangeRequestsPlugin(),
					new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
				],
			}),
			'GET'
		),
		e.registerRoute(
			/\.(?:mp4)$/i,
			new e.CacheFirst({
				cacheName: 'static-video-assets',
				plugins: [
					new e.RangeRequestsPlugin(),
					new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
				],
			}),
			'GET'
		),
		e.registerRoute(
			/\.(?:js)$/i,
			new e.StaleWhileRevalidate({
				cacheName: 'static-js-assets',
				plugins: [
					new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
				],
			}),
			'GET'
		),
		e.registerRoute(
			/\.(?:css|less)$/i,
			new e.StaleWhileRevalidate({
				cacheName: 'static-style-assets',
				plugins: [
					new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
				],
			}),
			'GET'
		),
		e.registerRoute(
			/\/_next\/data\/.+\/.+\.json$/i,
			new e.StaleWhileRevalidate({
				cacheName: 'next-data',
				plugins: [
					new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
				],
			}),
			'GET'
		),
		e.registerRoute(
			/\.(?:json|xml|csv)$/i,
			new e.NetworkFirst({
				cacheName: 'static-data-assets',
				plugins: [
					new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
				],
			}),
			'GET'
		),
		e.registerRoute(
			({ url: e }) => {
				if (!(self.origin === e.origin)) return !1
				const a = e.pathname
				return !a.startsWith('/api/auth/') && !!a.startsWith('/api/')
			},
			new e.NetworkFirst({
				cacheName: 'apis',
				networkTimeoutSeconds: 10,
				plugins: [
					new e.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 86400 }),
				],
			}),
			'GET'
		),
		e.registerRoute(
			({ url: e }) => {
				if (!(self.origin === e.origin)) return !1
				return !e.pathname.startsWith('/api/')
			},
			new e.NetworkFirst({
				cacheName: 'others',
				networkTimeoutSeconds: 10,
				plugins: [
					new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
				],
			}),
			'GET'
		),
		e.registerRoute(
			({ url: e }) => !(self.origin === e.origin),
			new e.NetworkFirst({
				cacheName: 'cross-origin',
				networkTimeoutSeconds: 10,
				plugins: [
					new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 3600 }),
				],
			}),
			'GET'
		)
})
