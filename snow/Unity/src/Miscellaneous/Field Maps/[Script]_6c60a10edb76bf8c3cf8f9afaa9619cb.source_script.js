answer = (function transformEntry(source) {

	var ans = '';
	var assignedto=source.assigned_to;
	var query = 'sys_id=' + assignedto + '^ORuser_name=' + assignedto; // Search by sys_id, name
	if(assignedto)
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