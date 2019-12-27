/*
 * InSync: Keep live data in sync between browser sessions and server
 *
 * Copyright : Derrell Lipman, 2019
 * License   : MIT
 * Authors   : Derrell Lipman (derrell)
 */

/**
 * A proxied object which can be kept in-sync between cooperating users.
 */
qx.Class.define("insync.Object",
{
  extend : qx.core.Object,

  /**
   * Instantiate a synchronized object
   *
   * @param {String} name
   *   The name of this object
   *
   * @param {String} topicPrefix
   *   The prefix to prepend to the object name to generate the topic name to
   *   which advertisements of changes to the object will be sent
   *
   * @param {insync.IMessageBus} messageBus
   *   The class instance which is used to dispatch advertisements of changes
   *   to the object.
   */
  construct : function(
    name,
    topicPrefix = "insync",
    messageBus = qx.event.message.Bus.getInstance())
  {
    this.base(arguments);

    // Save the topic prefix and message bus
    this.__topicPrefix = topicPrefix;
    this.__messageBus = messageBus;

    // Create the target object
    this.__target = {};

    // Create a proxy over the target
    this.__proxy = this._proxyObject(name, this.__target);
  },

  members :
  {
    __proxy       : null,
    __target      : null,
    __messageBus  : null,
    __topicPrefix : null,

    _proxyObject : function(name, target)
    {
      let             p;

      // Create the proxy over the specified target
      p = new Proxy(
        target,
        {
          // When a property of the proxy object is set, reflect it to
          // cooperating processes
          set : (target, prop, value) =>
            {
              console.log(
                `name=${name}, prop=${prop}, value=${JSON.stringify(value)}`);
              if (value instanceof Object)
              {
                // Do the default action, but create a new proxy for the
                // sub-object.
                Reflect.set(
                  target,
                  prop,
                  this._proxyObject(`${name}.${prop}`, value));

                // Let cooperating users know of this change
                this.__messageBus.dispatchByName(
                  `${this.__topicPrefix}.${name}.${prop}`,
                  value);
              }
              else
              {
                // Do the default action
                Reflect.set(target, prop, value);

                // Let cooperating users know of this change
                this.__messageBus.dispatchByName(
                  `${this.__topicPrefix}.${name}`,
                  value);
              }
            }
        });

      return p;
    },


    /**
     * Get the proxied object
     *
     * @return {Object}
     *   The proxied object
     */
    proxy : function()
    {
      return this.__proxy;
    }
  }
});


/*
'use strict';

const getDeep = require('lodash/get');
const toPath = require('lodash/toPath');
const defaults = require('lodash/defaults');
const clone = require('lodash/clone');
const isObjectLike = require('lodash/isObjectLike');

function get(obj, path) {
  if (!path)
    return obj;
  return getDeep(obj, path);
}

function push(arr, el) {
  const newArr = arr.slice();
  newArr.push(el);
  return newArr;
}

function pathPop(path) {
  const parentPath = clone(path);
  const key = parentPath[parentPath.length-1];
  parentPath.pop();
  return [parentPath, key];
}

// names of the traps that can be registered with ES6's Proxy object
const trapNames = [
  'apply',
  'construct',
  'defineProperty',
  'deleteProperty',
  'enumerate',
  'get',
  'getOwnPropertyDescriptor',
  'getPrototypeOf',
  'has',
  'isExtensible',
  'ownKeys',
  'preventExtensions',
  'set',
  'setPrototypeOf',
]

// a list of paramer indexes that indicate that the a recieves a key at that parameter
// this information will be used to update the path accordingly
const keys = {
  get: 1,
  set: 1,
  deleteProperty: 1,
  has: 1,
  defineProperty: 1,
  getOwnPropertyDescriptor: 1,
}

function DeepProxy(rootTarget, traps, options) {

  const path = options !== undefined && typeof options.path !== 'undefined' ? toPath(options.path) : [];

  function createProxy(target, path) {
    
    // avoid creating a new object between two traps
    const context = { rootTarget, path };

    const realTraps = {};

    for (const trapName of trapNames) {
      const keyParamIdx = keys[trapName]
          , trap = traps[trapName];

      if (typeof trap !== 'undefined') {

        if (typeof keyParamIdx !== 'undefined') {

          realTraps[trapName] = function () {

            const key = arguments[keyParamIdx];

            // update context for this trap
            context.nest = function (nestedTarget) {
              if (nestedTarget === undefined)
                nestedTarget = rootTarget;
              return createProxy(nestedTarget, push(path, key)); 
            }

            return trap.apply(context, arguments);
          }
        } else {

          realTraps[trapName] = function () {

            // update context for this trap
            context.nest = function (nestedTarget) {
              if (nestedTarget === undefined)
                nestedTarget = {};
              return createProxy(nestedTarget, path);
            }

            return trap.apply(context, arguments);
          }
        }
      }
    }

    return new Proxy(target, realTraps);
  }

  return createProxy(rootTarget, path);

}

module.exports = DeepProxy;
 */
