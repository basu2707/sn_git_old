(function runTransformScript(source, map, log, target /*undefined onStart*/ ) {
	//Created based on requirements in story STRY0015518
	
	var number = source.impacted_subscribers;
	// Exit Function if Impacted Subscribers is Not Provided or Invalid Value
	if (!number || (number >= 0) == false)
		return;
	
	// Search for the Automatically Generated Impacted Service Record and Update Estimated Subcount with Value
	var gr = new GlideRecord("task_cmdb_ci_service");
	gr.addQuery('task', target.sys_id);
	gr.addQuery('cmdb_ci_service', target.business_service);
	gr.query();
	if (gr.next())
		{
		gr.u_estimated_subcount = number;
		gr.update();
			
		// Set the import set state to update to make sure the response is returned right.
		if (source.sys_import_state == 'ignored' && source.impacted_subscribers != '')
			{
			source.sys_import_state = 'updated';
			source.status_message = '';
		}
	}
	
})(source, map, log, target);