answer = (function transformEntry(source) {
	
	var ci = source.u_primary_service;
	var ans = '';
	var query = 'sys_id=' + ci + '^ORname=' + ci; // Search for Business service with sys_id or name
	if(ci)
		{
		var FindCI = new GlideRecord('cmdb_ci_service');
		FindCI.addEncodedQuery(query);
		FindCI.query();
		if (FindCI.next()) {
			ans = FindCI.sys_id;
		}
	}
	return ans; // return the value to be put into the target field
	
})(source);