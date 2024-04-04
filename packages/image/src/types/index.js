/**
 * @typedef {Object} Rwd
 * @property {string} [mobile]
 * @property {string} [tablet]
 * @property {string} [laptop]
 * @property {string} [desktop]
 * @property {string} [default]
 */
/**
 * @typedef {Object} Breakpoint
 * @property {string} [mobile]
 * @property {string} [tablet]
 * @property {string} [laptop]
 * @property {string} [desktop]
 */

/**
 * @typedef {Object} ImageProps
 * @property {Object} props.images
 * - list of URL of images want to loaded.
 * - required.
 * @property {Object | null} [props.imagesWebP]
 * - list of URL of webP images want to loaded.
 * - optional, default value in null.
 * @property {String} [props.loadingImage]
 * - placeholder when loading image, it will show when item of `images` is not loaded.
 * - optional, default value is `""`.
 * @property {String} [props.defaultImage]
 * - default image, it will show if all items of `images` can not be loaded, and would become loading animation if `loadingImage` is not passed in.
 * - optional, default value is `""`.
 * @property {String} [props.alt]
 * - image alt.
 * - optional, default value is `""`.
 * @property {"fill"|"contain"|"cover"|"scale-down"|"none"|"initial"|"inherit"} [props.objectFit] - image CSS property. Optional, default value is `"cover"`.
 * @property {String | Number} [props.width]
 * - image width.
 * - optional, default value is `"100%"`.
 * @property {String | Number} [props.height]
 * - image height.
 * - optional, default value is `"100%"`.
 * @property {boolean} [props.priority]
 * - should preload image
 * @property {Boolean} [props.debugMode]
 * - can set if is in debug mode
 * - if `true`, then will print log after image loaded successfully of occur error.
 * - optional, default value is `false`.
 * @property {Breakpoint} [props.breakpoint]
 * - breakpoint of viewport width.
 * - optional, default value is `{ mobile: '767px', tablet: '1199px', laptop: '1439px', desktop: '2439px'}`
 * - For example, if we set breakpoint as `{ mobile: '767px', tablet: '1199px', laptop: '1439px', desktop: '2439px'}`,
 * - which means if viewport width is not greater then 767px, screen is mobile size, then we will get image sizes by comparing the value of `props.rwd`.
 * - It will affect which url of 'props.images' should loaded first.
 * @property {Rwd} [props.rwd]
 * - can set different sizes of image want to load first on different breakpoint of vw (viewport width),
 * such as {mobile: '300px', tablet: '400px', laptop: '800px', desktop: '1200px', default: '1600px'}.
 * - optional, default value is `{ mobile: '100vw', tablet: '100vw', laptop: '100vw', desktop: '100vw', default: '100vw'}`
 * - using `props.breakpoint` and `props.rwd`, you can decide different sizes of image is on each vw.
 * - if this param is default value, this sizes of images will equal to vw.
 * @property {IntersectionObserverInit} [props.intersectionObserverOptions]
 * - Options of intersection observers, let you control the circumstance of observers.
 * - Optional, default value is `{ root: null, rootMargin: '0px', threshold: 0.25, }`.
 * - See [Mdn Docs](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) to get more information.
 * @property {string} [props.className]
 */

export default {}
