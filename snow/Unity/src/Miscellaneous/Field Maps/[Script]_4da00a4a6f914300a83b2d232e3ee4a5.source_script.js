answer = (function transformEntry(source) {

    var ans = '';
    if (source.cause_code != '') {
		var inc = new GlideRecord("incident");
        inc.addQuery("number", source.number);
        inc.query();
        if (inc.next()) {

            var device = new GlideRecord("cmdb_ci_endpoint");
            device.addQuery("sys_id", inc.cmdb_ci);
            device.addQuery("type", "Fiber Node");
            device.query();
            if (!device.next()) {
        var Find = new GlideRecord('u_itsm_codes');
        Find.addEncodedQuery('u_name=' + source.cause_code + '^ORu_external_id=' + source.cause_code + '^u_active=true^u_type=2');
        Find.query();
        if (Find.next()) {
            ans = Find.sys_id;
        } 
    }
		}
	}
    return ans; // return the value to be put into the target field

})(source);