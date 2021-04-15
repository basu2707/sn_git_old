answer = (function transformEntry(source) {

	var ans = '';
	var cabdelegate=source.cab_delegate;
	var query = 'sys_id=' + cabdelegate + '^ORuser_name=' + cabdelegate; // Search by sys_id, name and user ID
	if(cabdelegate)
		{
		var usr = new GlideRecord('sys_user');		
		usr.addEncodedQuery(query);
		usr.query();
		if(usr.next()) {
			ans = usr.sys_id;
		}
	}
	return ans;

})(source);