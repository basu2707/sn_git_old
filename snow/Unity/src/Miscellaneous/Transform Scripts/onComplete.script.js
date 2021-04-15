(function runTransformScript(source, map, log, target /*undefined onStart*/ ) {
    //testasdfaddd

    // 	var dt = new GlideDateTime(target.start_date);
    // 	dt.setValueUTC(target.start_date,"yyyy-MM-dd HH:mm:ss");
    // The following list will control the fields that are returned in the response

    var state_val = target.getValue('state');
    var approval, work_notes, comments = '';
    var break_fix = 'false';
    var tableName = 'change_request';
    var recordID = target.sys_id;
    var backout_plan = '';
    var close_notes = '';
    var description = '';
    var implementation_plan = '';
    var justification = '';
    var test_plan = '';
    var u_pre_activity_validation = '';
    var cmdb_ci = '';
	var type = '';

    if (target.backout_plan != '') {
        backout_plan = target.backout_plan.replace(/(?:\r\n|\r|\n)/g, '\n');
    }
    if (target.close_notes != '') {
        close_notes = target.close_notes.replace(/(?:\r\n|\r|\n)/g, '\n');
    }
    if (target.description != '') {
        description = target.description.replace(/(?:\r\n|\r|\n)/g, '\n');
    }
    if (target.implementation_plan != '') {
        implementation_plan = target.implementation_plan.replace(/(?:\r\n|\r|\n)/g, '\n');
    }
    if (target.justification != '') {
        justification = target.justification.replace(/(?:\r\n|\r|\n)/g, '\n');
    }
    if (target.test_plan != '') {
        test_plan = target.test_plan.replace(/(?:\r\n|\r|\n)/g, '\n');
    }
    if (target.u_pre_activity_validation != '') {
        u_pre_activity_validation = target.u_pre_activity_validation.replace(/(?:\r\n|\r|\n)/g, '\n');
    }

   
 if (target.cmdb_ci.sys_class_name == "cmdb_ci_endpoint") {
                    var gr = new GlideRecord("cmdb_ci_endpoint");
                    gr.addQuery("sys_id", target.cmdb_ci);
                    gr.query();
                    if (gr.next()) {
                        type = gr.type;
                    }
                }

    // --------- Object for Device Type and Class fields STRY0023573 end -------------//
    //  gs.info("came    " + cmdb_ci);






    /*	Removed as mentioned in STRY0014889
    comments = new x_mcim_unified.UnityUtil().getJournalArray(tableName, recordID, 'comments');*/
    //work_notes = new x_mcim_unified.UnityUtil().getJournalArray(tableName, recordID, 'work_notes');

    if (state_val == '-3')
        approval = 'requested';
    else if (state_val == '-2' || state_val == '-1' || state_val == '0' || state_val == '30' || state_val == '3')
        approval = 'approved';
    else
        approval = "";

    //check and see if there are records within the 'Incidents Pending Change' related list for the current change request.
    var findinc = new GlideRecord('incident');
    findinc.addQuery('rfc', target.sys_id);
    findinc.query();
    if (findinc.next()) {
        break_fix = 'true';
    }

    /*var conflictCount= getConflictCount(target);
    //gs.info("mateen conflictCount {0}",conflictCount);
    	var conflistStatus = 'No Conflict';
    	var conflicts;
    	if(conflictCount > 0){
    		conflistStatus = "Conflict";
    		conflicts = getConflicts(target);
    	}*/

    //var conflicts = getConflicts(target);
    //gs.info('conflictsReturn: '+conflicts);
    //gs.info("Conflict array length {0}",conflicts[0]);

    var resultsList = {
        additional_assignee_list: target.additional_assignee_list.getDisplayValue(),
        Record_URL: gs.getProperty('glide.servlet.uri') + target.getLink(),
        approval: approval,
        assignment_group: target.assignment_group.getDisplayValue(),
        assigned_to: target.assigned_to.getDisplayValue(),
        backout_plan: backout_plan,
        //break_fix:target.break_fix,
        cab_delegate: target.cab_delegate.getDisplayValue(),
        cab_required: target.cab_required,
        category: target.category,
		subcategory: target.u_subcategory,
        change_plan: target.change_plan,
        close_code: target.close_code,
        close_notes: close_notes,
        closed_at: target.closed_at,
        closed_by: target.closed_by.getDisplayValue(),
        cmdb_ci: target.cmdb_ci,
		cmdb_ci_device_type :target.cmdb_ci.device_type.getDisplayValue(),
		cmdb_ci_type : type,
		cmdbd_ci_sys_class_name:target.cmdb_ci.sys_class_name.getDisplayValue(),
        //comments:comments,
        conflict_last_run: target.conflict_last_run,
        //conflict_status:conflistStatus,
        conflict_status: target.conflict_status,
        description: description,
        end_date: target.end_date,
        external_system_name: target.correlation_display,
        external_ticket_unique_id: target.correlation_id,
        external_source_url: target.u_correlation_url,
        integrated_systems: target.u_external_systems,
        implementation_plan: implementation_plan,
        impacted_partners: getGlideDisplay(target.u_impacted_partners),
        is_bulk: target.is_bulk,
        justification: justification,
        multi_day_change: target.u_multi_day_change,
        number: target.number,
        on_hold: target.on_hold,
        opened_at: target.opened_at,
        opened_by: target.opened_by.getDisplayValue(),
        owner: target.u_ptgw_owner.getDisplayValue(),
        parent: target.parent.getDisplayValue(),
        requested_by: target.requested_by.getDisplayValue(),
        risk: target.risk,
        risk_impact_analysis: target.risk_impact_analysis,
        short_description: target.short_description.toString().replace(/(?:\r\n|\r|\n)/g, '\n'),
        start_date: target.start_date,
        state: target.state,
        sys_updated_by: target.sys_updated_by,
        sys_updated_on: target.sys_updated_on,
        test_plan: test_plan,
        type: target.type,
        ccb: target.u_ccb.getDisplayValue(),
        change_validator: target.u_change_validator.getDisplayValue(),
        peer_reviewer: target.u_peer_reviewer.getDisplayValue(),
        peer_reviewer_group: target.u_peer_reviewer_group.getDisplayValue(),
        pre_activity_validation: u_pre_activity_validation,
        review: target.u_review,
        service_affect: target.u_service_affect,
        technical_reviewer: target.u_techical_reviewers.getDisplayValue(),
        technical_reviewer_group: target.u_technical_reviewer_group.getDisplayValue(),
        template: target.u_template.getDisplayValue(),
        tts_ticket_id: target.u_tts_ticket_id,
        tts_status: target.u_tts_status,
        tts_sm_id: target.u_tts_sm_id,
        watch_list: target.watch_list.getDisplayValue(),
        work_end: target.work_end,
        //work_notes:work_notes,
        work_notes_list: target.work_notes_list.getDisplayValue(),
        work_start: target.work_start,
        //conflict_count:conflictCount,
        //conflict_data:conflicts

    };

    // The following for loop will add the above elements to the REST response,if they are populated.
    if (source.sys_import_state == 'inserted' || source.sys_import_state == 'updated') {
        //gs.info('reponse1'+JSON.stringify(response));
        for (var element in resultsList) {
            if (resultsList[element])
                response[element] = resultsList[element];
        }
        //gs.info('reponse2'+JSON.stringify(response));
        //response.setBody(resultsList);
    }

	
//Commenting below 2 lines as part of STRY0028986
    //if (attachment_status)
      //  response.attachment_status = attachment_status;

})(source, map, log, target);

function getGlideDisplay(inputParms) {
    var displayVals = [];
    var acc = new GlideRecord("customer_account");
    acc.addEncodedQuery("sys_idIN" + inputParms);
    acc.query();
    while (acc.next()) {
        var acc_name = acc.getValue('name');
        displayVals.push(acc_name);
    }
    return displayVals.toString();

}
/*function getConflictCount(target){
	try{
		var conflictDetector = new global.ChangeCheckConflicts(target);
		var conflictResults = conflictDetector.check();
		return conflictResults;
	}catch(e){
		//gs.log('Error Ujjwal'+e);
		return 'error:'+e;
	}
}
function getConflicts(target){
	var conflicts = [];
	var conflictGr = new GlideRecord('conflict');
	conflictGr.addQuery('change',target.sys_id);
	conflictGr.query();
	//gs.info("mateen table count: {0}",conflictGr.getRowCount());
		while(conflictGr.next()){
			var conflict = {};
				conflict.type = conflictGr.getDisplayValue('type');
				if(conflict.conflicting_change != ''){
					conflict.conflictChange = {
						number: conflictGr.getDisplayValue('conflicting_change'),
						sysID: conflictGr.conflicting_change.sys_id.toString()
					};
				}
				if(conflict.configuration_item != ''){
					conflict.affectedCI= {
						name: conflictGr.getDisplayValue('configuration_item'),
						sysID: conflictGr.configuration_item.sys_id.toString()
					};
				}
				if(conflictGr.schedule != ''){
					conflict.schedule = {
						name: conflictGr.getDisplayValue('schedule'),
						sysID: conflictGr.getUniqueValue('schedule')
					};
				}
				if(conflictGr.getValue('u_start_date') != '' || conflictGr.getValue('u_blackout_starts') != '')
					conflict.start = (conflictGr.getValue('u_start_date') != '') ? conflictGr.getValue('u_start_date') : conflictGr.getValue('u_blackout_starts');
				if(conflictGr.getValue('u_end_date') != '' || conflictGr.getValue('u_blackout_ends') != '')
					conflict.end = (conflictGr.getValue('u_end_date') != '') ? conflictGr.getValue('u_end_date') : conflictGr.getValue('u_blackout_ends');
				//conflict = JSON.stringify(conflict);
				conflicts.push(conflict);
			}
			//gs.info("Array of conflicts data is {0}",conflicts.toString());
				return JSON.stringify(conflicts);
				//return conflicts;
			}*/