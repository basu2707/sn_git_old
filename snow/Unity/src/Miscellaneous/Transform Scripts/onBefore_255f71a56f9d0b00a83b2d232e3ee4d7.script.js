(function runTransformScript(source, map, log, target /*undefined onStart*/ ) {
	// The intent of this script is two-fold. Return an error if an invalid Change request Number is Provided
	// The script will also check if this is an update or new Change request. If it is a new Change request, it will return Error if the mandatory fields are not populated.
	
	var existingRecord = false;
	
	// If Number or External System Name/ID is Provided. Check if Exisitng Record Exists
	var number = source.number;
	var systemName = source.external_system_name;
	var ticketID = source.external_ticket_unique_id;
	
	var chgreq = new GlideRecord('change_request');
	
	// If Change request Number is Invalid, Return Error and Exit Function
	// If Change request Number is Valid, set 'existingRecord = True' and Continue
	if (number) {
		chgreq.addQuery('number', number);
		chgreq.query();
		
		if (!chgreq.hasNext()) {
			error = true;
			error_message = "Change request Number " + number + " Is Invalid";
			return;
		}
		
		existingRecord = true;
	}
	// Both External System Name and ID are Required
	// If Only One of the Two Fields are Provided, Return Error and Exit Function
	else if ((systemName && !ticketID) || (!systemName && ticketID)) {
		error = true;
		if (!systemName)
			error_message = "'external_system_name' is Required";
		else if (!ticketID)
			error_message = "'external_ticket_unique_id' is Required";
		
		return;
	}
	// If External System Name and ID is Required, Check For Existing Record
	// If Matching Record Exists, set 'existingRecord = True' and Continue
	else if (systemName && ticketID) {
		chgreq.addQuery('correlation_display', systemName);
		chgreq.addQuery('correlation_id', ticketID);
		chgreq.query();
		
		if (chgreq.hasNext())
			existingRecord = true;
	}
	
	// If set 'existingRecord = False', We Will Need to Check for Mandatory Fields
	// Return Error if Mandatory Fields Not Provided
	if(!existingRecord) {
		var missingFields = [];
		
		// Short Description is Always Mandatory
		if(!source.short_description)
			missingFields.push(" Short Description is Mandatory");
		// CI is Mandatory
		if(!source.cmdb_ci)
			missingFields.push(" Configuration Item is Mandatory");
		// Start date is Mandatory
		if(!source.start_date)
			missingFields.push(" Start Date is Mandatory");
		//End date is Mandatory
		if(!source.end_date)
			missingFields.push(" End date is Mandatory");
		
		
		if(missingFields.length>0) {
			
			error = true;
			error_message = "Data Policy Exception:" + missingFields.toString();
			
			return;
		}
		
		
		//If the target record is not available, then check whether CI with sys id passed is available in system, if not then dont allow it to create ticket
		if(!existingRecord)
			{
			
			var cmdbci_id=source.cmdb_ci;
			var queryBuild = 'sys_id=' + cmdbci_id + '^ORname=' + cmdbci_id;
			
			
			var chg_ci = new GlideRecord('cmdb_ci');
			chg_ci.addEncodedQuery(queryBuild);
			if(source.sys_created_by != "partner_gateway")
				{
				chg_ci.addEncodedQuery('sys_class_name!=cmdb_ci_service^sys_class_name!=service_offering');
			}
			chg_ci.query();
			if(!chg_ci.next())
				{
				error = true;
				error_message = "Data Policy Exception: CI passed is not found in ServiceNow";
			}
		}
		
		
		
		
	}
})(source, map, log, target);