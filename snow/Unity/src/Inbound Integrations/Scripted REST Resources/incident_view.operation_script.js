(function process(/*RESTAPIRequest*/ request, /*RESTAPIResponse*/ response) {
	var result = {};
		var query = '';
		var limit;
		var offset;
		var relatedList = false;
		
		// Convert Field Names in API sysparm_query to actual field names in SNOW Incident
		var fieldNameConversion = {
			correlation_id:"external_ticket_unique_id",
			correlation_display:"external_system_name",
			u_correlation_url:"external_source_url",
			u_cause_code:"cause_code",
			u_external_systems:"integrated_systems",
			u_ptgw_impacted_partners:"affected_partners",
			u_ptgw_owner:"owner",
			u_ptgw_resolving_partner:"resolving_partner",
			u_scope:"scope",
			u_service_affect:"service_affect",
			u_service_condition:"service_condition",
			u_severity_scale:"severity_scale",
			u_solution_code:"solution_code",
			u_symptom:"symptom",
			u_additional_comments:"comments",
			u_source:"source"
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
		var queryResults = new x_mcim_unified.UnityUtil().unity_get_incident(query, limit, offset,relatedList);
		response.setBody(queryResults);
	})(request, response);