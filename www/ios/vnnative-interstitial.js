let utils = require('utils');
//import { buildEvents, utils.exec, translateOptions } from './utils'

/**
 * Interstitial config object.
 * @typedef {BaseConfig} InterstitialConfig
 */

const events = utils.buildEvents('interstitial', [
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
let interstitial = {
  events : events,

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

module.export = interstitial;
