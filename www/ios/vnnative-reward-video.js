let utils = require('./utils');
//import { buildEvents, utils.exec, translateOptions } from './utils'

/**
 * Reward Video config object.
 * @typedef {BaseConfig} RewardVideoConfig
 */

const events = utils.buildEvents('rewardvideo', [
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
let rewardVideo = {
  events : events,

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

module.export = rewardVideo;
