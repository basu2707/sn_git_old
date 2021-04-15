answer = (function transformEntry(source) {

	// Add your code here
	var s_symptom = source.symptom;
	var ans = '';
	var query = 'sys_id=' + s_symptom + '^ORu_name=' + s_symptom + '^ORu_external_id=' + s_symptom; // Search by sys_id, name and user ID
	if(s_symptom)
		{
		var sympt = new GlideRecord('u_itsm_codes');		
		sympt.addEncodedQuery(query);
		sympt.query();
		if(sympt.next()) {
			ans = sympt.sys_id;
		}
	}
	return ans; // return the value to be put into the target field
})(source);