answer = (function transformEntry(source) {

	

	var ans = '';
	var techreviewer=source.technical_reviewer;
	var query = 'sys_id=' + techreviewer + '^ORuser_name=' + techreviewer; // Search by sys_id, name
	if(techreviewer)
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