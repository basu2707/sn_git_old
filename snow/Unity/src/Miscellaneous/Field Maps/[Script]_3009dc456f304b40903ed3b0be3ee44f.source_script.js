var inc = new GlideRecord("incident");
inc.addQuery("number", source.number);
inc.query();
if (inc.next()) {

    var device = new GlideRecord("cmdb_ci_endpoint");
    device.addQuery("sys_id", inc.cmdb_ci);
    device.addQuery("type", "Fiber Node");
    device.query();
    if (!device.next()) {
        answer = source.close_notes.replace(/(?:\r\n|\r|\n)/g, '\n');
    }
}