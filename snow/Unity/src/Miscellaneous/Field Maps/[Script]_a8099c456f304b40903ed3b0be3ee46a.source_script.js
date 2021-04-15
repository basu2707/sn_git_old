answer = (function transformEntry(source) {
	
	var s_assignto = source.assignment_group;
	var ans = '';
	var query = 'sys_id=' + s_assignto + '^ORname=' + s_assignto; // Search Assignment group with sys_id or name of the group
	if(s_assignto)
		{
		var grp = new GlideRecord('sys_user_group');
		grp.addEncodedQuery(query);
		grp.query();
		if(grp.next()) {
			ans = grp.sys_id;
		}
	}
	return ans; // return the value to be put into the target field
	
})(source);