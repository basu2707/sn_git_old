answer = (function transformEntry(source) {
	var s_affp = source.impacted_partners;
	var ans = '';
	var query = 'partner=true^sys_id=' + s_affp + '^ORname=' + s_affp; // Search owner with sys_id or name of the owner with Partner is true
	if(s_affp)
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
