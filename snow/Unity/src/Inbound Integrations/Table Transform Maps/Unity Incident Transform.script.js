(function transformRow(source, target, map, log, isUpdate) {
	var attachment_status = '';

	//This script ensures that External system Name (correlation_display) and External system ID (correlation_id) are never overridden once filled.
	
	var external_id=source.external_ticket_unique_id; // External ticket unique id and external system name from source table
	var external_name=source.external_system_name;

	var inc= new GlideRecord('incident');
	inc.addQuery('sys_id',target.sys_id);
	inc.query();
	if(inc.next())
	{

		if(inc.correlation_id=='')      //If correlation id of the record is empty,
			target.correlation_id = external_id; //then update the record with the new value from source table
		
		//commented this moving this to onBefore Script as its not working as expected here(STRY0029157)
		/*else if(external_id != '' && inc.correlation_id != external_id) //STRY0019833 - Return error if correlation id is being modified
		{
			error = true;
			error_message = "Incident " + inc.number + " already has a Correlation ID and it cannot be modified";
			//target.correlation_id = inc.correlation_id;//else prevent overriding - Commented due to STRY0019833
		}*/

		if(inc.correlation_display=='') //If correlation display of the record is empty
			target.correlation_display = external_name; //then update the record with the new value from source table
		else
			target.correlation_display = inc.correlation_display; //else prevent overriding

	}


})(source, target, map, log, action==="update");