answer = (function transformEntry(source) {

	var ans = '';
	var peerreviewer=source.peer_reviewer;
	var query = 'sys_id=' + peerreviewer + '^ORuser_name=' + peerreviewer; // Search by sys_id, name
	if(peerreviewer)
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