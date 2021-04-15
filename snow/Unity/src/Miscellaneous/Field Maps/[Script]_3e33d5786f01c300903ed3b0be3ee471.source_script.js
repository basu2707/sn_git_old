answer = (function transformEntry(source) {
	var s_ow = source.owner;
	var ans = '';
	var query = 'partner=true^sys_id=' + s_ow + '^ORname=' + s_ow; // Search owner with sys_id or name of the owner
	if(s_ow)
		{
		var gr = new GlideRecord('customer_account');
		gr.addEncodedQuery(query);
		gr.query();
		if(gr.next()) {
			ans = gr.sys_id;
		}
	}
	return ans;
	// return the value to be put into the target field
	
})(source);