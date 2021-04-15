(function runTransformScript(source, map, log, target /*undefined onStart*/ ) {

    //     if (action == 'insert') {
    //      if (source.sys_created_by.toLowerCase() == 'ama_snow' || source.sys_created_by.toLowerCase() == "tts_snow" || source.sys_created_by.toLowerCase() == "oiv_account" || source.sys_created_by.toLowerCase() == "partner_gateway") {


    //          target.state = '-9';
    //      }
    //  } else {
    //      if (source.state != '') {
    //          target.state = source.state;
    //      }
    //  }
    //  target.update();


    var device = new GlideRecord("cmdb_ci_endpoint");
    device.addQuery("sys_id", target.cmdb_ci);
    device.addQuery("type", "Fiber Node");
    device.query();
    if (!device.next()) {

        if (source.state != '') {
            target.state = source.state;
            target.update();
        }
    }




})(source, map, log, target);