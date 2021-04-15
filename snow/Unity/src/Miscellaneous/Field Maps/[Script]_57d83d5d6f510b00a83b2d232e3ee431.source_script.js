answer = (function transformEntry(source) {

	var ans = '';
	var changevalidator=source.change_validator;
	var query = 'sys_id=' + changevalidator + '^ORuser_name=' + changevalidator; // Search by sys_id, name
	if(changevalidator)
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