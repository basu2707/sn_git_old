answer = (function transformEntry(source) {
	
	var ci = source.u_affected_application;
	var ans = '';
	var query = 'sys_id=' + ci + '^ORname=' + ci +'^sys_class_name!=cmdb_ci_service^sys_class_name!=service_offering'; // Search for Business service with sys_id or name
	if(ci)
		{
		var FindCI = new GlideRecord('cmdb_ci');
		FindCI.addEncodedQuery(query);
		FindCI.query();
		if (FindCI.next()) {
			ans = FindCI.sys_id;
		}
	}
	return ans; // return the value to be put into the target field
	
})(source);