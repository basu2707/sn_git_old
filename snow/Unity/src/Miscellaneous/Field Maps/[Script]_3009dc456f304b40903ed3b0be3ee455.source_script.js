answer = (function transformEntry(source) {
	
	// Add your code here
	var s_assignto = source.assigned_to;
	var ans = '';
	var query = 'sys_id=' + s_assignto + '^ORuser_name=' + s_assignto; // Search by sys_id, name and user ID
	if(s_assignto)
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