answer = (function transformEntry(source) {

	var name = source.caller_id;
	var ans = '';
	var query = 'sys_id=' + name + '^ORuser_name=' +name; // Check if source value is sys_id, name or user ID
	if(name)
		{
		var Find = new GlideRecord('sys_user');
		Find.addEncodedQuery(query);
		Find.query();
		if (Find.next()) {
			ans = Find.sys_id;
		}
			else if(action == 'insert')
			ans = gs.getUserID();
				//ans = gs.getProperty('x_mcim_unified.unified.post.user'); // if we need to default to a particular user
	}
	else if(action == 'insert')
	ans = gs.getUserID();

	return ans; // return the value to be put into the target field

})(source);