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

module.exports = utils;