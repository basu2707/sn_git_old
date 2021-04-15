(function runTransformScript(source, map, log, target /*undefined onStart*/ ) {
    // The intent of this script is two-fold. Return an error if an invalid Incident Number is Provided
    // The script will also check if this is an update or new Incident. If new Incident, it will return Error if the mandatory fields are not populated.

    var existingRecord = false;

    // If Number or External System Name/ID is Provided. Check if Exisitng Record Exists
    var number = source.number;
    var systemName = source.external_system_name;
    var ticketID = source.external_ticket_unique_id;

    var gr = new GlideRecord('incident');

    // If Incident Number is Invalid, Return Error and Exit Function
    // If Incident Number is Valid, set 'existingRecord = True' and Continue
    if (number) {
        gr.addQuery('number', number);
        gr.query();

        if (!gr.hasNext()) {
            error = true;
            error_message = "Incident Number " + number + " Is Invalid";
            return;
        } else if (gr.next()) {
            //that means incident is present, verify if the correlation id is already populated and differnt from what PG has sent for update then error out 
            if (ticketID != '' && gr.correlation_id!='' && gr.correlation_id != ticketID) {
                error = true;
                error_message = "Incident " + gr.number + " already has a Correlation ID and it cannot be modified";
				return;
            }

        }

        existingRecord = true;
    }
    // Both External System Name and ID is Required
    // If Only One of the Two Fields is Provided, Return Error and Exit Function
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
        gr.addQuery('correlation_display', systemName);
        gr.addQuery('correlation_id', ticketID);
        gr.query();

        if (gr.hasNext())
            existingRecord = true;
    }

    // If set 'existingRecord = False', We Will Need to Check for Mandatory Fields
    // Return Error if Mandatory Fields Not Provided
    if (!existingRecord) {
        var missingFields = [];

        // Short Description is Always Mandatory
        if (!source.short_description)
            missingFields.push(" Short Description is Mandatory");
        // Either Primary Service or CI is Mandatory
        if (!source.business_service && !source.cmdb_ci)
            missingFields.push(" Primary Service or Configuration Item is Mandatory");

        if (missingFields.length > 0) {
            error = true;
            error_message = "Data Policy Exception:" + missingFields.toString();

            return;
        } else if (action == 'insert') {
            //Ticket Correlation for Multiple Alarms on Same Device
            //Avoid duplicate ticket creation with same short description and CIs
            var srcCI = source.cmdb_ci;
            var srcShrtDesc = source.short_description;
            var srcExtSystem = source.external_system_name;
            if (srcCI != '' && srcShrtDesc != '' && srcExtSystem != '') {
                srcCI = srcCI.trim();
                srcShrtDesc = srcShrtDesc.trim();
                var incQuery = 'stateNOT IN6,7,8^cmdb_ci.name=' + srcCI + '^short_description=' + srcShrtDesc + '^correlation_display=Spectrum';

                var grInc = new GlideRecord('incident');
                grInc.addEncodedQuery(incQuery);
                grInc.query();
                if (grInc.next()) {
                    grInc.work_notes = 'New Alarm received :\n\nAlarm Title : ' + srcShrtDesc + '\nCI : ' + srcCI + '\nExternal Ticket ID : ' + source.external_ticket_unique_id + '\nAlarm Notes : ' + source.alarm_notes;
                    grInc.update();
                    //log.info(''+grInc.number+' already exists with same CI and short description');
                    //status_message=''+grInc.number+' already exists with same CI and short description';
                    error = true;
                    error_message = '' + grInc.number + ' already exists with same CI and same short description';
                    //prepareResponse(source, map, log, target,grInc);
                    var work_notes, comments = '';
                    var tableName = 'incident';
                    var recordID = grInc.sys_id;
                    var attribute_urgency = 'urgency';
                    var attribute_impSub = 'impacted_subscribers';

                    /*
                    //Retreive Impacted Service Record to Include Impacted Subs in Response
                    var impactedSubReturn = "";
                    var serviceRecord = new GlideRecord("task_cmdb_ci_service");
                    serviceRecord.addQuery('task', grInc.sys_id);
                    serviceRecord.addQuery('cmdb_ci_service', grInc.business_service);
                    serviceRecord.query();
					
                    if (serviceRecord.next()) {
                    	impactedSubReturn = serviceRecord.u_estimated_subcount;
                    }
                    */
                    // To pass tags in the response
                    var tag = new global.TagYourIt();
                    var partner_urgency = tag.getTagValue(tableName, recordID, attribute_urgency);
                    var impactedSub = tag.getTagValue(tableName, recordID, attribute_impSub);

                    // The following list will control the fields that are returned in the response
                    var resultsList = {
                        affected_partners: grInc.u_ptgw_impacted_partners.getDisplayValue(),
                        assigned_to: grInc.assigned_to.getDisplayValue(),
                        assignment_group: grInc.assignment_group.getDisplayValue(),
                        business_service: grInc.business_service.getDisplayValue(),
                        caller_id: grInc.caller_id.getDisplayValue(),
                        category: grInc.category,
                        cause_code: grInc.u_cause_code.getDisplayValue(),
                        caused_by: grInc.caused_by.number.getDisplayValue(),
                        closed_at: grInc.closed_at,
                        closed_by: grInc.closed_by.getDisplayValue(),
                        close_code: grInc.close_code,
                        close_notes: grInc.close_notes,
                        cmdb_ci: grInc.cmdb_ci.getDisplayValue(),
                        //comments:comments,
                        contact_type: grInc.contact_type,
                        description: grInc.description,
                        external_system_name: grInc.correlation_display,
                        external_ticket_unique_id: grInc.correlation_id,
                        external_source_url: grInc.u_correlation_url,
                        impacted_subscribers: impactedSub,
                        integrated_systems: grInc.u_external_systems,
                        number: grInc.number,
                        opened_at: grInc.opened_at,
                        opened_by: grInc.opened_by.getDisplayValue(),
                        owner: grInc.u_ptgw_owner.getDisplayValue(),
                        parent_incident: grInc.parent_incident.number.getDisplayValue(),
                        partner_urgency: partner_urgency,
                        priority: grInc.priority,
                        priority_restoral: grInc.u_priority_restoral,
                        problem_id: grInc.problem_id.number.getDisplayValue(),
                        resolved_at: grInc.resolved_at,
                        resolved_by: grInc.resolved_by.getDisplayValue(),
                        resolving_partner: grInc.u_ptgw_resolving_partner.getDisplayValue(),
                        rfc: grInc.rfc.number.getDisplayValue(),
                        scope: grInc.u_scope,
                        service_affect: grInc.service_affect,
                        service_condition: grInc.u_service_condition,
                        severity: grInc.severity,
                        severity_scale: grInc.u_severity_scale.getDisplayValue(),
                        short_description: grInc.short_description,
                        solution_code: grInc.u_solution_code.getDisplayValue(),
                        state: grInc.state,
                        subcategory: grInc.subcategory,
                        symptom: grInc.u_symptom.getDisplayValue(),
                        sys_updated_by: grInc.sys_updated_by,
                        sys_updated_on: grInc.sys_updated_on,
                        tts_ticket_id: grInc.u_tts_ticket_id,
                        tts_status: grInc.u_tts_status,
                        watch_list: grInc.watch_list.getDisplayValue(),
                        //work_notes:work_notes,
                        work_notes_list: grInc.work_notes_list.getDisplayValue(),
                    };

                    // The following for loop will add the above elements to the REST response
                    for (var element in resultsList)
                        if (resultsList[element])
                            response[element] = resultsList[element];
                    return;
                }
            }
        }
    }
})(source, map, log, target);