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
