answer = (function transformEntry(source) {

	var ans = '';
	var cmdbci=source.cmdb_ci;
	var query = 'sys_id=' + cmdbci + '^ORname=' + cmdbci; // Search by sys_id, name
	if(cmdbci)
		{
		var ci = new GlideRecord('cmdb_ci');		
		ci.addEncodedQuery(query);
		ci.query();
		if(ci.next()) {
			ans = ci.sys_id;
		}
	}
	return ans; 
	 // return the value to be put into the target field

})(source);