/*
 * InSync: Keep live data in sync between browser sessions and server
 *
 * Copyright : Derrell Lipman, 2019
 * License   : MIT
 * Authors   : Derrell Lipman (derrell)
 */

/**
 * Utility functions
 */
qx.Class.define("insync.Util",
{
  extend : qx.core.Object,

  statics :
  {
    _objects : {},

    recover : function(message)
    {
      let             key;
      let             obj;
      let             data;
      let             parent;

      // Retrieve the object
      obj = insync.Util._objects[message.name];

      switch(message.type)
      {
      case "data" :
        // If the object already exists, destroy it
        if (obj)
        {
          for (key in obj)
          {
            delete obj[key];
          }
        }
        else
        {
          obj = {};
          insync.Util._objects[message.name] = obj;
        }

        // Clone the provided data
        for (key in message.data)
        {
          obj[key] = message.data[key];
        }
        break;

      case "changes" :
        // For each change...
        for (data of message.data)
        {
          // Get to the immediate parent
          parent = obj;
          for (key of data.parent)
          {
            parent = parent[key];
          }

          // Set or delete the property value
          if (data.type == "delete")
          {
            delete parent[data.property];
          }
          else
          {
            parent[data.property] = data.value;
          }
        }
        break;

      case "remove" :
        delete insync.Util._objects[message.name];
        break;
      }

      return obj;
    }
  }
});
