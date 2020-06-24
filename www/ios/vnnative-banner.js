//import { buildEvents, exec, translateOptions } from './utils'
let utils = require('utils');
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

const events = utils.buildEvents('banner', [
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

let banner = {
  events : events,

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

module.export = banner;
