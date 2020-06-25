let exec = require('cordova/exec');


/**
 * Base config object.
 * @typedef {Object} BaseConfig
 * @property {string} [id=TESTING_AD_ID] - Ad Unit ID
 * @property {boolean} [isTesting=false] - Receiving test ad
 * @property {boolean} [autoShow=true] - Auto show ad when loaded
 *
 * @property {boolean|null} [forChild=null]
 * Child-directed setting.
 * Default is not calling `tagForChildDirectedTreatment`.
 * Set to `true` for `tagForChildDirectedTreatment(true)`.
 * Set to `false` for `tagForChildDirectedTreatment(false)`.
 * @see https://firebase.google.com/docs/admob/android/targeting#child-directed_setting
 *
 * @property {boolean|null} [forFamily=null]
 * Designed for Families setting.
 * Android-only.
 * Default is not calling `setIsDesignedForFamilies`.
 * Set to `true` for `setIsDesignedForFamilies(true)`.
 * Set to `false` for `setIsDesignedForFamilies(false)`.
 * @see https://firebase.google.com/docs/admob/android/targeting#designed_for_families_setting
 *
 * @property {Array<number>|null} [location=null]
 * Location targeting.
 * It accept an array in the form of `[latitude, longitude]`.
 * Android-only.
 * Default is not calling `setLatitude` and `setLongitude`.
 */
let utils = new Object;
/**
 * @ignore
 */
utils.exec = function(method, args) {
  return new Promise((resolve, reject) => {
    exec(resolve, reject, 'AdMob', method, args)
  })
}

/**
 * @ignore
 */
utils.isFunction = function(x) {
  return typeof x === 'function'
}

utils.isString = function(x) {
  return typeof x === 'string'
}

/**
 * @ignore
 */
utils.wrapCallbacks = function(p, successCallback, failureCallback) {
  if (utils.isFunction(successCallback)) {
    p = p.then(successCallback) // eslint-disable-line no-param-reassign
  }
  if (utils.isFunction(failureCallback)) {
    p = p.catch(failureCallback) // eslint-disable-line no-param-reassign
  }
  return p
}

utils.boolean2string = function(x) {
  if (x === null) {
    return ''
  }
  if (x === true) {
    return 'yes'
  }
  if (x === false) {
    return 'no'
  }
  return x
}

/**
 * @ignore
 */
utils.translateOptions = function(options) {
  /* eslint-disable no-console */
  const opts = {}
  if (options.forChild) {
    opts.forChild = utils.boolean2string(options.forChild)
    if (utils.isString(options.forChild)) {
      console.warn(
        '`forChild` will not accept string in future, pass boolean instead',
      )
    }
  }
  if (options.forChild) {
    opts.forFamily = utils.boolean2string(options.forFamily)
    if (utils.isString(options.forFamily)) {
      console.warn(
        '`forFamily` will not accept string in future, pass boolean instead',
      )
    }
  }
  /* eslint-enable no-console */
  return {
    ...options,
    ...opts,
    // TODO update native implementation using `size`
    adSize: options.size,
  }
}

/**
 * @ignore
 */
utils.buildEvents = function(adType, eventKeys) {
  return eventKeys.reduce((acc, eventKey) => {
    acc[eventKey] = `admob.${adType}.events.${eventKey}`
    return acc
  }, {})
}



/**
 * Banner config object.
 * @typedef {BaseConfig} BannerConfig
 * @property {boolean} [bannerAtTop=false] - set to true, to put banner at top
 * @property {boolean} [overlap=true] -
 * set to true, to allow banner overlap webview
 * @property {boolean} [offsetTopBar=false] -
 * set to true to avoid ios7 status bar overlap
 * @property {string} [size=SMART_BANNER] - {@link BANNER_SIZE}
 */

const events_banner = utils.buildEvents('banner', [
  'LOAD',
  'LOAD_FAIL',
  'OPEN',
  'CLOSE',
  'EXIT_APP',
])

/**
 * @typedef {Object} BANNER_SIZE
 * @property {string} BANNER - BANNER
 * @property {string} IAB_BANNER - IAB_BANNER
 * @property {string} IAB_LEADERBOARD - IAB_LEADERBOARD
 * @property {string} IAB_MRECT - IAB_MRECT
 * @property {string} LARGE_BANNER - LARGE_BANNER
 * @property {string} SMART_BANNER - SMART_BANNER
 * @property {string} FLUID - FLUID
 */
/**
 * @constant
 * @type {Object}
 */
const sizes = {
  BANNER: 'BANNER',
  IAB_BANNER: 'IAB_BANNER',
  IAB_LEADERBOARD: 'IAB_LEADERBOARD',
  IAB_MRECT: 'IAB_MRECT',
  LARGE_BANNER: 'LARGE_BANNER',
  SMART_BANNER: 'SMART_BANNER',
  FLUID: 'FLUID',
  // android-only
  FULL_BANNER: 'FULL_BANNER',
  LEADERBOARD: 'LEADERBOARD',
  MEDIUM_RECTANGLE: 'MEDIUM_RECTANGLE',
  SEARCH: 'SEARCH',
  WIDE_SKYSCRAPER: 'WIDE_SKYSCRAPER',
}

/**
 * @protected
 * @desc
 * See usage in {@link banner}.
 */

let _banner = {
  events : events_banner,

  /**
   * Banner sizes
   * @type {BANNER_SIZE}
   */
  sizes : sizes,

  /**
   * @protected
   * @param {BannerConfig} opts - Initial config.
   */
  constructor : function(opts) {
    this.config({
      size: sizes.SMART_BANNER,
      ...opts,
    })
  },

  /**
   * Update config.
   *
   * @param {BannerConfig} opts - New config.
   * @returns {BannerConfig} Updated config.
   */
  config : function(opts) {
    this._config = {
      ...this._config,
      ...opts,
    }
    return this._config
  },

  /**
   * Create banner.
   *
   * @returns {Promise} Excutaion result promise.
   */
  prepare : function() {
    const options = {
      publisherId: this._config.id,
      ...this._config,
    }
    delete options.id
    return utils.exec('createBannerView', [utils.translateOptions(options)])
  },

  /**
   * Show the banner.
   *
   * @returns {Promise} Excutaion result promise.
   */
  show : function() {
    return utils.exec('showAd', [true])
  },

  /**
   * Hide the banner.
   *
   * @returns {Promise} Excutaion result promise.
   */
  hide : function() {
    return utils.exec('showAd', [false])
  },

  /**
   * Remove the banner.
   *
   * @returns {Promise} Excutaion result promise.
   */
  remove : function() {
    return utils.exec('destroyBannerView', [])
  }
}

/**
 * Interstitial config object.
 * @typedef {BaseConfig} InterstitialConfig
 */

const events_interstitial = utils.buildEvents('interstitial', [
  'LOAD',
  'LOAD_FAIL',
  'OPEN',
  'CLOSE',
  'EXIT_APP',
])

/**
 * @protected
 * @desc
 * See usage in {@link interstitial}.
 */
let _interstitial = {
  events : events_interstitial,

  /**
   * @protected
   * @param {InterstitialConfig} opts - Initial config.
   */
  constructor : function(opts) {
    this.config({
      ...opts,
    })
  },

  /**
   * Update config.
   *
   * @param {InterstitialConfig} opts - New config.
   * @returns {InterstitialConfig} Updated config.
   */
  config : function(opts) {
    this._config = {
      ...this._config,
      ...opts,
    }
    return this._config
  },

  /**
   * @returns {Promise} Excutaion result promise.
   */
  prepare : function() {
    const options = {
      interstitialAdId: this._config.id,
      ...this._config,
    }
    delete options.id
    return utils.exec('prepareInterstitial', [utils.translateOptions(options)])
  },

  /**
   * @returns {Promise} Excutaion result promise.
   */
  show : function() {
    return utils.exec('showInterstitialAd', [true])
  },

  /**
   * @returns {Promise} Excutaion result promise.
   */
  isReady : function() {
    return utils.exec('isInterstitialReady', [])
  }
}

/**
 * Reward Video config object.
 * @typedef {BaseConfig} RewardVideoConfig
 */

const events_rewardvideo = utils.buildEvents('rewardvideo', [
  'LOAD',
  'LOAD_FAIL',
  'OPEN',
  'CLOSE',
  'EXIT_APP',
  'START',
  'REWARD',
])

/**
 * See usage in {@link rewardvideo}.
 * @protected
 */
let _rewardVideo = {
  events : events_rewardvideo,

  /**
   * @protected
   * @param {RewardVideoConfig} opts - Initial config.
   */
  constructor : function(opts) {
    this.config({
      ...opts,
    })
  },

  /**
   * Update config.
   *
   * @param {RewardVideoConfig} opts - New config.
   * @returns {RewardVideoConfig} Updated config.
   */
  config : function(opts) {
    this._config = {
      ...this._config,
      ...opts,
    }
    return this._config
  },

  /**
   * @returns {Promise} Excutaion result promise.
   */
  prepare : function() {
    const options = {
      rewardVideoId: this._config.id,
      ...this._config,
    }
    delete options.id
    return utils.exec('createRewardVideo', [translateOptions(options)])
  },

  /**
   * @returns {Promise} Excutaion result promise.
   */
  show : function() {
    return utils.exec('showRewardVideo', [true])
  },

  /**
   * @returns {Promise} Excutaion result promise.
   */
  isReady : function() {
    return utils.exec('isRewardVideoReady', [])
  }
}

/**
 * @type {Banner}
 * @since 0.6
 * @emits {admob.banner.events.LOAD}
 * @emits {admob.banner.events.LOAD_FAIL}
 * @emits {admob.banner.events.OPEN}
 * @emits {admob.banner.events.CLOSE}
 * @emits {admob.banner.events.EXIT_APP}
 * @example 
 * admob.banner.config({
 *  id: 'ca-app-pub-xxx/xxx',
 * })
 *
 * // Create banner
 * admob.banner.prepare()
 *
 * // Show the banner
 * admob.banner.show()
 *
 * // Hide the banner
 * admob.banner.hide()
 *
 * // Remove the banner
 * admob.banner.remove()
 */
let app = new Object;
app.banner = _banner;

/**
 * @type {Interstitial}
 * @since 0.6
 * @emits {admob.interstitial.events.LOAD}
 * @emits {admob.interstitial.events.LOAD_FAIL}
 * @emits {admob.interstitial.events.OPEN}
 * @emits {admob.interstitial.events.CLOSE}
 * @emits {admob.interstitial.events.EXIT_APP}
 * @example
 * admob.interstitial.config({
 *  id: 'ca-app-pub-xxx/xxx',
 * })
 *
 * admob.interstitial.prepare()
 *
 * admob.interstitial.show()
 */
app.interstitial = _interstitial;

/**
 * @external {cordova-admob-mediation} https://github.com/rehy/cordova-admob-mediation
 */
/**
 * Reward video requires mediation SDK to be installed,
 * see {@link cordova-admob-mediation} for list of supported networks.
 * @type {RewardVideo}
 * @since 0.6
 * @emits {admob.rewardvideo.events.LOAD}
 * @emits {admob.rewardvideo.events.LOAD_FAIL}
 * @emits {admob.rewardvideo.events.OPEN}
 * @emits {admob.rewardvideo.events.CLOSE}
 * @emits {admob.rewardvideo.events.EXIT_APP}
 * @emits {admob.rewardvideo.events.START}
 * @emits {admob.rewardvideo.events.REWARD}
 * @example
 * admob.rewardvideo.config({
 *  id: 'ca-app-pub-xxx/xxx',
 * })
 *
 * admob.rewardvideo.prepare()
 *
 * admob.rewardvideo.show()
 */
app.rewardvideo = _rewardVideo;

// Old APIs

/**
 * Set options.
 *
 * @deprecated since version 0.6
 * @param {Object} options
 * @param {string} options.publisherId
 * @param {string} options.interstitialAdId
 *
 * @param {boolean} [options.bannerAtTop=false]
 * Set to true, to put banner at top.
 * @param {boolean} [options.overlap=true]
 * Set to true, to allow banner overlap webview.
 * @param {boolean} [options.offsetTopBar=false]
 * Set to true to avoid ios7 status bar overlap.
 * @param {boolean} [options.isTesting=false]    Receiving test ad.
 * @param {boolean} [options.autoShow=true]
 * Auto show interstitial ad when loaded.
 *
 * @param {boolean|null} [options.forChild=null]
 * Default is not calling `tagForChildDirectedTreatment`.
 * Set to "true" for `tagForChildDirectedTreatment(true)`.
 * Set to "false" for `tagForChildDirectedTreatment(false)`.
 *
 * @param {boolean|null} [options.forFamily=null]
 * Android-only.
 * Default is not calling `setIsDesignedForFamilies`.
 * Set to "true" for `setIsDesignedForFamilies(true)`.
 * Set to "false" for `setIsDesignedForFamilies(false)`.
 *
 * @param {function()} [successCallback]
 * @param {function()} [failureCallback]
 */


app.setOptions = function(options, successCallback, failureCallback) {
  if (typeof options === 'object') {
    Object.keys(options).forEach(k => {
      switch (k) {
        case 'publisherId':
          app.banner._config.id = options[k]
          break
        case 'bannerAtTop':
        case 'overlap':
        case 'offsetTopBar':
          app.banner._config[k] = options[k]
          break
        case 'interstitialAdId':
          app.interstitial._config.id = options[k]
          break
        case 'rewardVideoId':
          app.rewardvideo._config.id = options[k]
          break
        case 'isTesting':
        case 'autoShow':
          app.banner._config[k] = options[k]
          app.interstitial._config[k] = options[k]
          app.rewardvideo._config[k] = options[k]
          break
        default:
      }
    })
    exec(successCallback, failureCallback, 'AdMob', 'setOptions', [
      utils.translateOptions(options),
    ])
  } else if (typeof failureCallback === 'function') {
    failureCallback('options should be specified.')
  }
}

/**
 * Ad sizes.
 * @constant
 * @type {BANNER_SIZE}
 * @deprecated since version 0.6
 */
app.AD_SIZE = Banner.sizes

/* eslint-disable no-console */
/**
 * @deprecated since version 0.6
 */
app.createBannerView = function(
  options = {},
  successCallback,
  failureCallback,
) {
  console.warn('Use admob.banner.prepare() instead.')
  exec(successCallback, failureCallback, 'AdMob', 'createBannerView', [
    utils.translateOptions(options),
  ])
}

/**
 * @deprecated since version 0.6
 */
app.destroyBannerView = function(options, successCallback, failureCallback) {
  console.warn('Use admob.banner.remove() instead.')
  exec(successCallback, failureCallback, 'AdMob', 'destroyBannerView', [])
}

/**
 * @deprecated since version 0.6
 */
app.showAd = function(show = true, successCallback, failureCallback) {
  console.warn('Use admob.banner.show() and admob.banner.hide() instead.')
  exec(successCallback, failureCallback, 'AdMob', 'showAd', [show])
}

/**
 * @deprecated since version 0.6
 */
app.createInterstitialView = function(
  options,
  successCallback,
  failureCallback,
) {
  console.warn(
    'Use admob.interstitial.prepare() instead, it will do both createInterstitialView() and requestInterstitialAd().',
  )
  exec(successCallback, failureCallback, 'AdMob', 'createInterstitialView', [
    utils.translateOptions(options),
  ])
}

/**
 * @deprecated since version 0.6
 */
app.requestInterstitialAd = function(
  options = {},
  successCallback,
  failureCallback,
) {
  console.warn(
    'Use admob.interstitial.prepare() instead, it will do both createInterstitialView() and requestInterstitialAd().',
  )
  exec(successCallback, failureCallback, 'AdMob', 'requestInterstitialAd', [
    utils.translateOptions(options),
  ])
}

/**
 * @deprecated since version 0.6
 */
app.prepareInterstitial = function(
  options = {},
  successCallback,
  failureCallback,
) {
  console.warn('Use admob.interstitial.prepare() instead.')
  exec(successCallback, failureCallback, 'AdMob', 'prepareInterstitial', [
    utils.translateOptions(options),
  ])
}

/**
 * @deprecated since version 0.6
 */
app.showInterstitial = function(successCallback, failureCallback) {
  console.warn('Use admob.interstitial.show() instead.')
  utils.wrapCallbacks(interstitial.show(), successCallback, failureCallback)
}

/**
 * @deprecated since version 0.6
 */
app.showInterstitialAd = function(
  show = true,
  successCallback,
  failureCallback,
) {
  console.warn('Use admob.interstitial.show() instead.')
  exec(successCallback, failureCallback, 'AdMob', 'showInterstitialAd', [show])
}
/* eslint-enable no-console */

module.exports = app;
