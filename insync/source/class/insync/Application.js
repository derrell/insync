qx.Class.define("insync.Application",
{
  extend : qx.application.Basic,

  members :
  {
    main : function()
    {
      let             Lodash = insync.Lodash;

      let obj = { a : [ 2, 3, { b : "hello" } ], c : "world" };
      Lodash.init();
      console.log(Lodash.get(obj, "a[1]"));
      console.log(Lodash.get(obj, "a[2].b"));
    }
  }
});
