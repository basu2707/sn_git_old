answer = (function transformEntry(source) {

	var ans = '';
	var template=source.template;
	var query = 'sys_id=' + template + '^ORname=' + template; // Search by sys_id, name
	if(template)
		{
		var usr = new GlideRecord('sys_template');		
		usr.addEncodedQuery(query);
		usr.query();
		if(usr.next()) {
			ans = usr.sys_id;
		}
	}
	return ans; 

})(source);