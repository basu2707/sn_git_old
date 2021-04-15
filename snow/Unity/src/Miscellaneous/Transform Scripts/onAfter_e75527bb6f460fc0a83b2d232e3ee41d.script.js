(function runTransformScript(source, map, log, target /*undefined onStart*/ ) {

    //This script makes sure that if CI and business that are sent in the POST request for CHANGE,do not find a match in Snow the ticket shall still be created, but the input values for CI and business service shall be pushed to the 'work_notes' field
    if (source.cmdb_ci != '') {

        var chg = new GlideRecord('change_request');
        chg.addQuery('sys_id', target.sys_id);
        chg.query();
        if (chg.next()) {
        
            if (target.cmdb_ci == '' && source.cmdb_ci != '') //If no match is found for CI
                chg.work_notes = "CI from external system not found in ServiceNow : " + source.cmdb_ci;

            if (!gs.nil(source.tts_status)) {
                if (source.tts_status.toLowerCase() == 'new' && source.tts_ticket_id == '' && target.u_tts_ticket_id != '')
                    chg.u_tts_ticket_id = '';
            }

            if (source.error_category == '' && target.u_error_category != '')
                chg.error_category = '';


            chg.update();
        }
    }

    // Add your code here
	
	if(source.source_job_id != '' || source.source_job_name != '' || source.source_platform != '' || source.source_additional_links != '' || source.source_job_link != '' || source.source_system !=''){
		var xOrg = new GlideRecord('u_originating_system_details');
		xOrg.initialize();
		xOrg.u_parent = target.sys_id.toString();
		xOrg.u_source_job_name = source.source_job_name;
		xOrg.u_source_platform = source.source_platform;
		xOrg.u_source_job_link = source.source_job_link;
		xOrg.u_additional_links = source.source_additional_links;
		xOrg.u_source_job_id = source.source_job_id;
		xOrg.u_source_job_sub_id = source.source_job_sub_id;
		xOrg.u_source_system = source.source_system;
		xOrg.insert();
		
	}

})(source, map, log, target);