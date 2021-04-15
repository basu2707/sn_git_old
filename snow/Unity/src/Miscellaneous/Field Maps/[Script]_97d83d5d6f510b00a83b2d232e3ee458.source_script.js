answer = (function transformEntry(source) {

	var techgrp = source.technical_reviewer_group;
	var ans = '';
	var query = 'sys_id=' + techgrp + '^ORname=' + techgrp; // Search Assignment group with sys_id or name of the group
	if(techgrp)
		{
		var grp = new GlideRecord('sys_user_group');
		grp.addEncodedQuery(query);
		grp.query();
		if(grp.next()) {
			ans = grp.sys_id;
		}
	}
	return ans; 

})(source);