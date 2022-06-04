qx.Class.define("demoapp.Application",
{
  extend : qx.application.Native,

  members :
  {
    /**
     * @lint ignoreDeprecated(alert)
     */
    main : function()
    {
      this.base(arguments);

      let             p1;
      let             p2;
      let             out1;
      let             out2;
      let             input;
      let             output;
      let             insync1;
      let             insync2;
      let             test1 = { initial : "data" };
      let             test2 = { some : "thing" };
      const           Insync = insync.Insync;
      const           messageBus = qx.event.message.Bus.getInstance();

      messageBus.subscribe(
        "insync.*",
        (busMessage) =>
          {
            let             out;
            let             message = busMessage.getData();
            switch(message.name)
            {
            case "test1" :
              out1 = insync.Util.recover(message);
              out = out1;
              break;

            case "test2" :
              out2 = insync.Util.recover(message);
              out = out2;
              break;
            }
            console.log(`Recovered ${message.name}, type ${message.type}:\n` +
                        JSON.stringify(out));
          },
        this);
      

      insync1 = new Insync(
        "test1",
        test1,
        (name, changes) =>
          {
//            console.log(`${name}: ${JSON.stringify(changes, null, "  ")}`);
          },
        this);
      insync1.setPublisher(insync.MessageBusPublisher.publish);
      p1 = insync1.getProxy();

      insync2 = new Insync(
        "test2",
        test2,
        (name, changes) =>
          {
//            console.log(`${name}: ${JSON.stringify(changes, null, "  ")}`);
          },
        this);
      insync2.setPublisher(insync.MessageBusPublisher.publish);
      p2 = insync2.getProxy();

      p1.hello = "world";
      p1.a = { b : { c : { d : "hi there" } } };

      p2.hi = "hi";
      p2.x = [ 23, 42, 69 ];
      p2.x[2] = 223;

      p1.b = 42;
      delete p1.a.b.c;
      p1.y = 888;
      p1.a.b.c = 777;
      p1.a.b["c.d"] = 99;

      input = JSON.stringify(p1);
      output = JSON.stringify(out1);
      if (input != output)
      {
        console.log("test1 FAILED");
        console.log("input:\n" + JSON.stringify(p1));
        console.log("output:\n" + JSON.stringify(out1));
      }

      input = JSON.stringify(p2);
      output = JSON.stringify(out2);
      if (input != output)
      {
        console.log("test2 FAILED");
        console.log("input:\n" + JSON.stringify(p2));
        console.log("output:\n" + JSON.stringify(out2));
      }
    }
  }
});
