answer = (function transformEntry(source) {

	var assignmentgrp = source.assignment_group;
	var ans = '';
	var query = 'sys_id=' + assignmentgrp + '^ORname=' + assignmentgrp; // Search Assignment group with sys_id or name of the group
	if(assignmentgrp)
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