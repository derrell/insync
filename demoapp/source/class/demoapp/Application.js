qx.Class.define("demoapp.Application",
{
  extend : qx.application.Standalone,

  members :
  {
    /**
     * @lint ignoreDeprecated(alert)
     */
    main : function()
    {
      this.base(arguments);

      // Enable logging in debug variant
      if (qx.core.Environment.get("qx.debug"))
      {
        let logger = qx.log.appender.Console;
      }

      // Create a button
      var button1 = new qx.ui.form.Button("Click me", "demoapp/test.png");

      // Document is the application root
      var doc = this.getRoot();

      // Add button to document at fixed coordinates
      doc.add(button1, {left: 100, top: 50});

      // Add an event listener
      button1.addListener("execute", function() {
        /* eslint no-alert: "off" */
        alert("Hello World!");
      });

      let             Lodash = insync.Lodash;
      let obj = { a : [ 2, 3, { b : "hello" } ], c : "world" };

      Lodash.init();
      console.log(Lodash.get(obj, "a[1]"));
      console.log(Lodash.get(obj, "a[2].b"));
    }
  }
});
