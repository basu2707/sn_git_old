answer = (function transformEntry(source) {

	var ans = '';
	var ccb=source.ccb;
	var query = 'sys_id=' + ccb + '^ORname=' + ccb; // Search by sys_id, name
	if(ccb)
		{
		var ccbname = new GlideRecord('cab_definition');		
		ccbname.addEncodedQuery(query);
		ccbname.query();
		if(ccbname.next()) {
			ans = ccbname.sys_id;
		}
	}
	return ans; // return the value to be put into the target field
	

})(source);