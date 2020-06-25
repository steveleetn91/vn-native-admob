let exec = require('cordova/exec');
let isUndefined = require('../../node_modules/lodash/isUndefined');

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
let app = new Object;
/**
 * @ignore
 */
app.exec = function(method, args) {
  return new Promise((resolve, reject) => {
    exec(resolve, reject, 'AdMob', method, args)
  })
}

/**
 * @ignore
 */
app.isFunction = function(x) {
  return typeof x === 'function'
}

app.isString = function(x) {
  return typeof x === 'string'
}

/**
 * @ignore
 */
app.wrapCallbacks = function(p, successCallback, failureCallback) {
  if (app.isFunction(successCallback)) {
    p = p.then(successCallback) // eslint-disable-line no-param-reassign
  }
  if (app.isFunction(failureCallback)) {
    p = p.catch(failureCallback) // eslint-disable-line no-param-reassign
  }
  return p
}

app.boolean2string = function(x) {
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
app.translateOptions = function(options) {
  /* eslint-disable no-console */
  const opts = {}
  if (!isUndefined(options.forChild)) {
    opts.forChild = app.boolean2string(options.forChild)
    if (app.isString(options.forChild)) {
      console.warn(
        '`forChild` will not accept string in future, pass boolean instead',
      )
    }
  }
  if (!isUndefined(options.forFamily)) {
    opts.forFamily = app.boolean2string(options.forFamily)
    if (app.isString(options.forFamily)) {
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
app.buildEvents = function(adType, eventKeys) {
  return eventKeys.reduce((acc, eventKey) => {
    acc[eventKey] = `admob.${adType}.events.${eventKey}`
    return acc
  }, {})
}

module.export = app;