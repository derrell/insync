/*
 * InSync: Keep live data in sync between browser sessions and server
 *
 * Copyright : Derrell Lipman, 2019
 * License   : MIT
 * Authors   : Derrell Lipman (derrell)
 */

/**
 * An implementation of a publisher that uses the qooxdoo MessageBus
 */
qx.Class.define("insync.MessageBusPublisher",
{
  extend : qx.core.Object,

  statics :
  {
    /**
     * Function called when publishing is requested. This one publishes on the
     * qooxdoo MessageBus
     *
     * @param {String} name
     *   The proxy's name.
     *
     * @param {String} type
     *   The type of message. This is typically one of "data", "changes", or
     *   "remove".
     *
     * @param {Object} data
     *   The type-specific data to be published.
     *
     * @param {Number} serial
     *   Serial number of this message
     */
    publish : function(name, type, data, serial)
    {
      let             message;
      const           messageBus = qx.event.message.Bus.getInstance();
      
        message =
          {
            name   : name,
            type   : type,
            serial : serial,
            data   : data
          };
        messageBus.dispatchByName(`insync.${type}`, message);
    }
  }
});
