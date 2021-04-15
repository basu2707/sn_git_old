(function runTransformScript(source, map, log, target /*undefined onStart*/ ) {

    // Set the journal field values in the desired format
    var work_notes, comments, impactedSubReturn = '';
    var tableName = 'incident';
    var recordID = target.sys_id;
    var attribute_urgency = 'urgency';
    var attribute_impSub = 'impacted_subscribers';
    var close_notes = '';
    var description = '';
var cmdb_ci = '';
	var type = '';
    /*Removed as mentioned on STRY0014889
	comments = new x_mcim_unified.UnityUtil().getJournalArray(tableName, recordID, 'comments');
	work_notes = new x_mcim_unified.UnityUtil().getJournalArray(tableName, recordID, 'work_notes');
 	*/

    //Retreive Impacted Service Record to Include Impacted Subs in Response

    var serviceRecord = new GlideRecord("task_cmdb_ci_service");
    serviceRecord.addQuery('task', target.sys_id);
    serviceRecord.addQuery('cmdb_ci_service', target.business_service);
    serviceRecord.query();

    if (serviceRecord.next()) {
        impactedSubReturn = serviceRecord.u_estimated_subcount;
    }
    //Pass multi like strings if they are not empty
    if (target.close_notes != '') {
        close_notes = target.close_notes.replace(/(?:\r\n|\r|\n)/g, '\n');
    }
    if (target.description != '') {
        description = target.description.replace(/(?:\r\n|\r|\n)/g, '\n');
    }

    // To pass tags in the response
    var tag = new global.TagYourIt();
    //var partner_urgency = tag.getTagValue(tableName,recordID,attribute_urgency); //As part of Stroy STRY0018815 Partner Urgency will be sent as information on field.
    var partner_urgency = target.u_partner_urgency;
    //STRY0018815 ends.
    //var impactedSub = tag.getTagValue(tableName,recordID,attribute_impSub);
    
            // The following list will control the fields that are returned in the response

 if (target.cmdb_ci.sys_class_name == "cmdb_ci_endpoint") {
                    var gr = new GlideRecord("cmdb_ci_endpoint");
                    gr.addQuery("sys_id", target.cmdb_ci);
                    gr.query();
                    if (gr.next()) {
                        type = gr.type;
                    }
                }

    
    var resultsList = {
        affected_partners: target.u_ptgw_impacted_partners.getDisplayValue(),
        Record_URL: gs.getProperty('glide.servlet.uri') + target.getLink(),
        assigned_to: target.assigned_to.getDisplayValue(),
        assignment_group: target.assignment_group.getDisplayValue(),
        business_service: target.business_service.getDisplayValue(),
        caller_id: target.caller_id.getDisplayValue(),
        category: target.category,
        cause_code: target.u_cause_code.getDisplayValue(),
        caused_by: target.caused_by.number.getDisplayValue(),
        closed_at: target.closed_at,
        closed_by: target.closed_by.getDisplayValue(),
        close_code: target.close_code,
        close_notes: close_notes,

        // added source
        source: target.u_source,
		// added 'Updated By System' as part of SFSTRY0002166
		updated_by_system: target.u_updated_by_system,
        cmdb_ci: target.cmdb_ci,
		cmdb_ci_device_type :target.cmdb_ci.device_type.getDisplayValue(),
		cmdb_ci_type : type,
		cmdbd_ci_sys_class_name:target.cmdb_ci.sys_class_name.getDisplayValue(),
        //comments:comments,
        description: description,
        external_system_name: target.correlation_display,
        external_ticket_unique_id: target.correlation_id,
        external_source_url: target.u_correlation_url,
        impacted_subscribers: impactedSubReturn,
        integrated_systems: target.u_external_systems,
        number: target.number,
        opened_at: target.opened_at,
        opened_by: target.opened_by.getDisplayValue(),
        owner: target.u_ptgw_owner.getDisplayValue(),
        parent_incident: target.parent_incident.number.getDisplayValue(),
        partner_urgency: partner_urgency,
        priority: target.priority,
        priority_restoral: target.u_priority_restoral,
        problem_id: target.problem_id.number.getDisplayValue(),
        resolved_at: target.resolved_at,
        resolved_by: target.resolved_by.getDisplayValue(),
        resolving_partner: target.u_ptgw_resolving_partner.getDisplayValue(),
        rfc: target.rfc.number.getDisplayValue(),
        scope: target.u_scope,
        service_affect: target.service_affect,
        service_condition: target.u_service_condition,
        severity: target.severity,
        severity_scale: target.u_severity_scale.getDisplayValue(),
        short_description: target.short_description.replace(/(?:\r\n|\r|\n)/g, '\n'),
        solution_code: target.u_solution_code.getDisplayValue(),
        state: target.state,
        subcategory: target.subcategory,
        symptom: target.u_symptom.getDisplayValue(),
        sys_updated_by: target.sys_updated_by,
        sys_updated_on: target.sys_updated_on,
        tts_ticket_id: target.u_tts_ticket_id,
        tts_status: target.u_tts_status,
        watch_list: target.watch_list.getDisplayValue(),
        //work_notes:work_notes,
        work_notes_list: target.work_notes_list.getDisplayValue(),
		on_hold_reason: target.hold_reason.getDisplayValue(),
    };

    // The following for loop will add the above elements to the REST response
    if (source.sys_import_state == 'inserted' || source.sys_import_state == 'updated') {
        for (var element in resultsList)
            if (resultsList[element])
                response[element] = resultsList[element];

    }

    // Send attachment status when attachments are sent through UNITY 
    if (attachment_status)
        response.attachment_status = attachment_status;

})(source, map, log, target);