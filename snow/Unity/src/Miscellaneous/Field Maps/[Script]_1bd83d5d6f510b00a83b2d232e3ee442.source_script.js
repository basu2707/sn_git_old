answer = (function transformEntry(source) {

	var ans = '';
	var requestedby=source.requested_by;
	var query = 'sys_id=' + requestedby + '^ORuser_name=' + requestedby; // Search by sys_id, name and user ID
	if(requestedby)
		{
		var usr = new GlideRecord('sys_user');		
		usr.addEncodedQuery(query);
		usr.query();
		if(usr.next()) {
			ans = usr.sys_id;
		}
	}
	return ans; // return the value to be put into the target field
	

})(source);