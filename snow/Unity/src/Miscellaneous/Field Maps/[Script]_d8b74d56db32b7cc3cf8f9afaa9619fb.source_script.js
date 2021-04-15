answer = (function transformEntry(source) {

	var id = 'NULL'; // Stores the sys_id of the matching record
	var query = 'number=' + source.number;
	// Check if the Source change number matches with any in Servicenow
	var rec = new GlideRecord('sc_req_item');
	rec.addEncodedQuery(query);
	rec.query();
	if (rec.next()) {
		id = rec.sys_id;
	}
	else if(source.external_ticket_unique_id != '' && source.external_system_name !='') 
		{
	// Check if in the Source external ticket ID and External system name matches with any in Servicenow
		query ='correlation_id=' + source.external_ticket_unique_id + '^correlation_display=' + source.external_system_name;
		var corid = new GlideRecord('sc_req_item');
		corid.addEncodedQuery(query);
		corid.query();
		if (corid.next()) {
			id = corid.sys_id;
		}
	}
	return id;

})(source);