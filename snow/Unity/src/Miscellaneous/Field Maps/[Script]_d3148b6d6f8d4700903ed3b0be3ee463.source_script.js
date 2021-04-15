answer = (function transformEntry(source) {
var ans ='';
	var inc = new GlideRecord("incident");
        inc.addQuery("number", source.number);
        inc.query();
        if (inc.next()) {

            var device = new GlideRecord("cmdb_ci_endpoint");
            device.addQuery("sys_id", inc.cmdb_ci);
            device.addQuery("type", "Fiber Node");
            device.query();
            if (!device.next()) {
				ans = source.close_code;
			}
		}
	return ans; // return the value to be put into the target field

})(source);