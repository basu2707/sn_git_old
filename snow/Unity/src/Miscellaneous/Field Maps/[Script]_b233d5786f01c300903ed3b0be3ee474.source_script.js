answer = (function transformEntry(source) {
	var s_rp = source.resolving_partner;
	var ans = '';
	var query = 'partner=true^sys_id=' + s_rp + '^ORname=' + s_rp; // Search owner with sys_id or name of the owner
	if(s_rp)
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