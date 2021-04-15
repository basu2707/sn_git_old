(function runTransformScript(source, map, log, target /*undefined onStart*/ ) {

	//This script makes sure that if CI and business that are sent in the POST request for INC,do not find a match in Snow the ticket shall still be created, but the input values for CI and business service shall be pushed to the 'work_notes' field

	if(source.cmdb_ci!='' || source.business_service!='')
	{
		var inc=new GlideRecord('incident');
		inc.addQuery('sys_id',target.sys_id); 
		inc.query();
		if(inc.next())
		{
			if(target.cmdb_ci=='' && source.cmdb_ci!='') //If no match is found for CI
				inc.work_notes="CI from external system not found in ServiceNow : "+source.cmdb_ci;

			if(target.business_service=='' && source.business_service!='') //If no match is found for business service
				inc.work_notes="Primary Service from external system not found in ServiceNow : "+source.business_service;
			inc.update();
		}
	}

	//STRY0019668: When multiple Business Services are sent from TTS, they will be added in Impacted Services in the Incident.
	var input_list = source.business_service.split(';');
	var final_list = [];

	//Get list of Business Services
	for(var i=0 ; i < input_list.length ; i++)
	{
		if(input_list[i].trim() == '')
			continue;
		//Service CI with exact matching Service Name or sys_id
		var service_ci = new GlideRecord('cmdb_ci_service');
		service_ci.addEncodedQuery('sys_id=' + input_list[i].trim() + '^ORname=' + input_list[i].trim() );
		service_ci.query();
		if(service_ci.next())
			final_list.push(service_ci.sys_id.toString());
		else
		{
			var bus_ci = new GlideRecord('cmdb_ci_service');
			bus_ci.addQuery("u_external_service_name",input_list[i].trim() );
			bus_ci.query();
			//For Service CI with exact matching External Service Name, use the matching Service.
			if(bus_ci.getRowCount() == 1)
			{
				bus_ci.next();
				final_list.push(bus_ci.sys_id.toString());
			}
			//For Service CI with multiple matching External Service Name, use the IOP Parent.
			else if(bus_ci.getRowCount() > 1)
			{
				while(bus_ci.next())
					if(bus_ci.parent != '')
					{
						final_list.push(bus_ci.parent.toString());
						break;
					}
			}
		}
	}

	//Insert the list of Business Services as Impacted Services in the Incident
	for(var j=0 ; j < final_list.length ; j++)
	{
		var impacted = new GlideRecord('task_cmdb_ci_service');
		impacted.addQuery('cmdb_ci_service',final_list[j]);
		impacted.addQuery('task',target.sys_id);
		impacted.query();
		if(!impacted.next())
		{
			impacted.initialize();
			impacted.cmdb_ci_service = final_list[j];
			impacted.task = target.sys_id;
			impacted.insert();
		}
	}

})(source, map, log, target);