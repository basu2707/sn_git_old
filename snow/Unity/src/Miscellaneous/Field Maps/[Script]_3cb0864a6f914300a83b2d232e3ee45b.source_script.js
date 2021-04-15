answer = (function transformEntry(source) {
    var ans = '';
    if (source.solution_code != '') {

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
                // STRY0024004 Query to check if source value can be mapped to a value in ITSM code table
                Find.addEncodedQuery('u_name=' + source.solution_code + '^ORu_external_id=' + source.solution_code + '^u_active=true^u_type=3');
                Find.query();
                if (Find.next()) {
                    ans = Find.sys_id;
                }

            }
        }
    }
    return ans; // return the value to be put into the target field

})(source);