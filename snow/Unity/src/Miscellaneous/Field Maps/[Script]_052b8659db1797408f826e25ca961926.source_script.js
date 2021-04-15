answer = (function transformEntry(source) {

	var name = source.u_assignment_group;
	var ans = '';
	var query = 'sys_id=' + name + '^ORname=' +name; // Check if source value is sys_id, name or user ID
	if(name)
		{
		var Find = new GlideRecord('sys_user_group');
		Find.addEncodedQuery(query);
		Find.query();
		if (Find.next()) {
			ans = Find.sys_id;
		}
		}
	return ans; // return the value to be put into the target field

})(source);