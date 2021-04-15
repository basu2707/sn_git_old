answer = (function transformEntry(source) {
	
	var name = source.u_account;
	var number = source.u_account_number;
	var query = "name="+name+"^u_account_number=" +number;
	if(name!= '' && number != ''){
		var Find = new GlideRecord('customer_account');
		Find.addEncodedQuery(query);
		Find.query();
		if (Find.next()) {
			ans = Find.sys_id;
		}
		else{
			Find.initialize();
			Find.name = name;
			Find.u_account_number = number;
			Find.u_email = source.u_email;
			Find.insert();
			ans = Find.sys_id;
		}
	}
	return ans; // return the value to be put into the target field
	
	
})(source);