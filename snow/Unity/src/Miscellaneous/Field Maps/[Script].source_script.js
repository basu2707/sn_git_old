answer = (function transformEntry(source) {

	var name = source.u_symptom;
	var ans = '';
	var query = 'sys_id=' + name + '^ORu_name=' +name+'^u_type=1'; // Check if source value is sys_id, name or user ID
	
	if(name)
		{
		var Find = new GlideRecord('u_itsm_codes');
		Find.addEncodedQuery(query);
		Find.query();
		if (Find.next()) {
			ans = Find.sys_id;
		}
		}
	return ans; // return the value to be put into the target field

})(source);