(function process(/*RESTAPIRequest*/ request, /*RESTAPIResponse*/ response) {
	
	var result = {};
		var query = '';
		var limit;
		var offset;
		var relatedList = false;
		
		// Convert Field Names in API sysparm_query to actual field names in SNOW Change
		var fieldNameConversion = {
			correlation_id:"external_ticket_unique_id",
			correlation_display:"external_system_name",
			u_ccb:"ccb",
			u_change_validator:"change_validator",
			u_correlation_url:"external_source_url",
			u_external_systems:"integrated_systems",
			u_impacted_partners:"impacted_partners",
			u_peer_reviewer:"peer_reviewer",
			u_peer_reviewer_group:"peer_reviewer_group",
			u_pre_activity_validation:"pre_activity_validation",
			u_ptgw_owner:"owner",
			u_review:"review",
			u_service_affect:"service_affect",
			u_technical_reviewer:"technical_reviewer",
			u_technical_reviewer_group:"technical_reviewer_group",
			u_template:"u_template",
			u_tts_ticket_id:"tts_ticket_id",
		    u_tts_sm_id:"tts_sm_id",
			u_additional_comments:"comments"
		};
		
		// Capture encoded sysparm_query if provided
		if (request.queryParams.sysparm_query) {
			query = request.queryParams.sysparm_query.toString();
			
			// Convert Field Names in API to System Field Names in SNOW Incident
			for (var element in fieldNameConversion) {
				query = query.replaceAll(fieldNameConversion[element], element);
			}
		}
		
		// Verify if we need to return related List
		if(request.queryParams.sysparm_relatedlist == 'true')
			relatedList = true;
		
		// Capture Limit and Offset Parameters
		if (request.queryParams.sysparm_limit > 0)
			limit = request.queryParams.sysparm_limit.toString();
		if (request.queryParams.sysparm_offset > 0)
			offset = request.queryParams.sysparm_offset.toString();
		
		// Call Script Include, Pass any Query, and Return Results in REST Response
		var queryResults = new x_mcim_unified.UnityUtil().unity_get_change(query, limit, offset,relatedList);
		// Set the result from the script include function into the response body
		response.setBody(queryResults);
		
	})(request, response);