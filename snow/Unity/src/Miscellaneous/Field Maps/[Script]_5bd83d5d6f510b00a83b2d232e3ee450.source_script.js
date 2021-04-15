answer = (function transformEntry(source) {

	var peerreviewgrp = source.peer_reviewer_group;
	var ans = '';
	var query = 'sys_id=' + peerreviewgrp + '^ORname=' + peerreviewgrp; // Search Assignment group with sys_id or name of the group
	if(peerreviewgrp)
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