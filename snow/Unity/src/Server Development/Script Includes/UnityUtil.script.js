var UnityUtil = Class.create();

UnityUtil.prototype = {
    initialize: function() {},

    unity_get_incident: function(queryParam, limitParam, offsetParam, relatedList) {

        var ans, caller_id, alarms, assigned_to, assignment_group, business_service, caused_by, closed_by, cmdb_ci, cmdb_ci_endpoint, opened_by, parent_incident, problem_id, resolved_by, rfc, severity_scale, query, numb, category, closed_at, close_code, close_notes, comments, contact_type, external_system_name, external_ticket_unique_id, description, knowledge, opened_at, priority, resolved_at, severity, short_description, state, subcategory, sys_updated_by, sys_updated_on, scope, service_affect, service_condition, watch_list, work_notes, work_notes_list, u_ptgw_owner, u_ptgw_resolving_partner, affected_partners, external_systems, u_symptom, u_cause_code, u_solution_code, recordID, sys_id, external_source_url, impacted_services, affected_ci, outages, affected_account, affected_market, started, rel, triaged, mitigated, partner_urgency, priority_restoral, tts_status, tts_ticket_id, record_url, source, updated_by_system, on_hold_reason, error_category = "";


        var collect = [];
        var tableName = 'incident';
        var limit;

        if (parseInt(limitParam) > 0)
            limit = parseInt(limitParam);
        else
            limit = 10000;

        relatedList = true; // Bring in related lists, requirement for  STRY0023573 //

        var findinc = new GlideRecord('incident');
        findinc.addEncodedQuery(queryParam); // Pass dynamic query parameter
        findinc.setLimit(limit);
        if (parseInt(offsetParam))
            findinc.chooseWindow(parseInt(offsetParam), parseInt(offsetParam) + limit);
        findinc.query();
        while (findinc.next()) {
            //--------- String and Date Fields ---------------//
         //   record_url = gs.getProperty('glide.servlet.uri') + findinc.getLink(),
                source = findinc.u_source,
                numb = findinc.number.getDisplayValue();
            sys_id = findinc.sys_id.getDisplayValue();
            recordID = findinc.sys_id;
			// added 'Updated By System' as part of SFSTRY0002166
			updated_by_system = findinc.u_updated_by_system;
            closed_at = findinc.getValue('closed_at');
            started = findinc.getValue('u_started');
            close_code = findinc.close_code.getDisplayValue();
            close_notes = findinc.close_notes.getDisplayValue();
            comments = new x_mcim_unified.UnityUtil().getJournalArray(tableName, recordID, 'u_additional_comments');
            external_system_name = findinc.correlation_display.getDisplayValue();
            external_ticket_unique_id = findinc.correlation_id.getDisplayValue();
            description = findinc.description.getDisplayValue();
            knowledge = findinc.knowledge.getDisplayValue();
            opened_at = findinc.getValue('opened_at');
            resolved_at = findinc.getValue('resolved_at');
            short_description = findinc.short_description.getDisplayValue();
            sys_updated_by = findinc.sys_updated_by.getDisplayValue();
            sys_updated_on = findinc.getValue('sys_updated_on');
            watch_list = findinc.watch_list.getDisplayValue();
            work_notes = new x_mcim_unified.UnityUtil().getJournalArray(tableName, recordID, 'work_notes');
            alarms = new x_mcim_unified.UnityUtil().getJournalArray(tableName, recordID, 'u_alarm_notes');
            work_notes_list = findinc.work_notes_list.getDisplayValue();
            external_source_url = findinc.u_correlation_url.getDisplayValue();
            mitigated = findinc.getValue('u_mitigated');
            triaged = findinc.getValue('u_triaged');
            tts_ticket_id = findinc.u_tts_ticket_id.getDisplayValue();

            //-------------- To pass tags ----------------------------//		
            // To pass tags in the response
            var attribute = 'urgency';
            var tag = new global.TagYourIt();
            //partner_urgency = tag.getTagValue(tableName,recordID,attribute);		 //As part of Story STRY0018815, Partner Urgency is mapped as Partner Urgency field on Incident.
            partner_urgency = findinc.u_partner_urgency.toString();
            //Story STRY0018815 ends

            // --------------- Drop Down Fields ---------------------//
            category = findinc.getValue('category');
            contact_type = findinc.getValue('contact_type');
            priority = findinc.getValue('priority');
            priority_restoral = findinc.getValue('u_priority_restoral');
            severity = findinc.getValue('severity');
            scope = findinc.getValue('u_scope');
            service_affect = findinc.getValue('u_service_affect');
            service_condition = findinc.getValue('u_service_condition');
            state = findinc.getValue('state');
            subcategory = findinc.getValue('subcategory');
            tts_status = findinc.getValue('u_tts_status');
            error_category = findinc.getValue('u_error_category');
            on_hold_reason = findinc.getValue('hold_reason');


            // ----------------Related Lists--------------------------------------//
            if (relatedList == true) {
                impacted_services = new x_mcim_unified.UnityUtil().getImpactedServices(sys_id);
                affected_ci = new x_mcim_unified.UnityUtil().getAffectedCIs(sys_id);
                outages = new x_mcim_unified.UnityUtil().getOutages(sys_id);
                affected_account = new x_mcim_unified.UnityUtil().getAffectedAccount(sys_id);
                affected_market = new x_mcim_unified.UnityUtil().getAffectedMarket(sys_id, findinc.u_primary_market.getDisplayValue());
            }
            //----------------------------------------------------------------------//

            if (!category)
                category = "";

            if (!contact_type)
                contact_type = "";

            if (!priority)
                priority = "";

            if (!severity)
                severity = "";

            if (!scope)
                scope = "";

            if (!service_affect)
                service_affect = "";

            if (!service_condition)
                service_condition = "";

            if (!state)
                state = "";

            if (!subcategory)
                subcategory = "";

            if (!affected_partners)
                affected_partners = "";


            // --------- Object for On Hold Reason field STRY0023326 start -------------//
            if (findinc.hold_reason != '') {
                on_hold_reason = {};
                on_hold_reason.display_value = findinc.hold_reason.getDisplayValue();
                on_hold_reason.value = findinc.getValue('hold_reason');
            } else {
                on_hold_reason = '';
            }


            // --------- Object for On Hold Reason field STRY0023326 end -------------//

            // --------------- Reference fields ---------------------//
            if (findinc.assigned_to) {
                assigned_to = {};
                assigned_to.display_value = findinc.assigned_to.getDisplayValue();
                assigned_to.value = findinc.getValue('assigned_to');
                assigned_to.user_name = findinc.assigned_to.user_name;


            } else
                assigned_to = findinc.assigned_to;


            if (findinc.caller_id) {
                caller_id = {};
                caller_id.display_value = findinc.caller_id.getDisplayValue();
                caller_id.value = findinc.getValue('caller_id');
                caller_id.user_name = findinc.caller_id.user_name;
            } else
                caller_id = findinc.caller_id;

            if (findinc.u_ptgw_owner) {
                u_ptgw_owner = {};
                u_ptgw_owner.display_value = findinc.u_ptgw_owner.getDisplayValue();
                u_ptgw_owner.value = findinc.getValue('u_ptgw_owner');
            } else
                u_ptgw_owner = findinc.u_ptgw_owner;

            if (findinc.u_ptgw_resolving_partner != '') { //Update != '' condition to get accurate condition.

                u_ptgw_resolving_partner = {};
                u_ptgw_resolving_partner.display_value = findinc.u_ptgw_resolving_partner.getDisplayValue();
                u_ptgw_resolving_partner.value = findinc.getValue('u_ptgw_resolving_partner');
            } else {
                u_ptgw_resolving_partner = ''; //Updated '' to send empty.
            }


            if (findinc.assignment_group) {
                assignment_group = {};
                assignment_group.display_value = findinc.assignment_group.getDisplayValue();
                assignment_group.value = findinc.getValue('assignment_group');
                assignment_group.group_id = findinc.assignment_group.u_group_id;
                assignment_group.area_id = findinc.assignment_group.u_area_id;
            } else
                assignment_group = findinc.assignment_group;


            if (findinc.business_service) {
                business_service = {};
                business_service.display_value = findinc.business_service.getDisplayValue();
                business_service.value = findinc.getValue('business_service');
            } else
                business_service = findinc.business_service;

            if (findinc.caused_by) {
                caused_by = {};
                caused_by.display_value = findinc.caused_by.number.getDisplayValue();
                caused_by.value = findinc.getValue('caused_by');
            } else
                caused_by = findinc.caused_by;

            if (findinc.closed_by) {
                closed_by = {};
                closed_by.display_value = findinc.closed_by.getDisplayValue();
                closed_by.value = findinc.getValue('closed_by');
                closed_by.user_name = findinc.closed_by.user_name;
            } else
                closed_by = findinc.closed_by;

            if (findinc.cmdb_ci) {
                cmdb_ci = {};
                if (findinc.cmdb_ci.device_type == 'vCMTS' && findinc.cmdb_ci.sys_class_name == "cmdb_ci_netgear") {
                    cmdb_ci.display_value = findinc.cmdb_ci.fqdn;
                } else

                    cmdb_ci.display_value = findinc.cmdb_ci.name;

                cmdb_ci.value = findinc.getValue('cmdb_ci');

                //GL Code for CMDB records
                cmdb_ci.u_gl_code = findinc.cmdb_ci.u_gl_code;

                // --------- Objects for Device Type, Class and Type fields - STRY0023573 start -------------//

                cmdb_ci.sys_class_name = findinc.cmdb_ci.sys_class_name.getDisplayValue();
                if (findinc.cmdb_ci.device_type != '') {
                    cmdb_ci.device_type = findinc.cmdb_ci.device_type;
                }
                if (findinc.cmdb_ci.sys_class_name == "cmdb_ci_endpoint") {
                    var gr = new GlideRecord("cmdb_ci_endpoint");
                    gr.addQuery("sys_id", findinc.cmdb_ci);
                    gr.query();
                    if (gr.next()) {
                        cmdb_ci.type = gr.type;
                    }
                }

                // --------- Objects for Device Type, Class and Type fields - STRY0023573 end -------------//

            } else
                cmdb_ci = findinc.cmdb_ci;

            if (findinc.opened_by) {
                opened_by = {};
                opened_by.display_value = findinc.opened_by.getDisplayValue();
                opened_by.value = findinc.getValue('opened_by');
                opened_by.user_name = findinc.opened_by.user_name;
            } else
                opened_by = findinc.opened_by;

            if (findinc.parent_incident) {
                parent_incident = {};
                parent_incident.display_value = findinc.parent_incident.number.getDisplayValue();
                parent_incident.value = findinc.getValue('parent_incident');
            } else
                parent_incident = findinc.parent_incident;

            if (findinc.problem_id) {
                problem_id = {};
                problem_id.display_value = findinc.problem_id.number.getDisplayValue();
                problem_id.value = findinc.getValue('problem_id');
            } else
                problem_id = findinc.problem_id;

            if (findinc.resolved_by) {
                resolved_by = {};
                resolved_by.display_value = findinc.resolved_by.getDisplayValue();
                resolved_by.value = findinc.getValue('resolved_by');
                resolved_by.user_name = findinc.resolved_by.user_name;
            } else
                resolved_by = findinc.resolved_by;

            if (findinc.rfc) {
                rfc = {};
                rfc.display_value = findinc.rfc.number.getDisplayValue();
                rfc.value = findinc.getValue('rfc');
            } else
                rfc = findinc.rfc;

            if (findinc.u_severity_scale) {
                severity_scale = {};
                severity_scale.display_value = findinc.u_severity_scale.getDisplayValue();
                severity_scale.value = findinc.getValue('u_severity_scale');
            } else
                severity_scale = findinc.u_severity_scale;

            if (findinc.u_symptom) {
                u_symptom = {};
                u_symptom.display_value = findinc.u_symptom.getDisplayValue();
                u_symptom.value = findinc.getValue('u_symptom');
                u_symptom.external_id = findinc.u_symptom.u_external_id;

            } else
                u_symptom = findinc.u_symptom;

            if (findinc.u_cause_code) {
                u_cause_code = {};
                u_cause_code.display_value = findinc.u_cause_code.getDisplayValue();
                u_cause_code.value = findinc.getValue('u_cause_code');
                u_cause_code.external_id = findinc.u_cause_code.u_external_id;
            } else
                u_cause_code = findinc.u_cause_code;

            if (findinc.u_solution_code) {
                u_solution_code = {};
                u_solution_code.display_value = findinc.u_solution_code.getDisplayValue();
                u_solution_code.value = findinc.getValue('u_solution_code');
                u_solution_code.external_id = findinc.u_solution_code.u_external_id;
            } else
                u_solution_code = findinc.u_solution_code;

            if (findinc.u_ptgw_impacted_partners) {
                affected_partners = {};
                affected_partners.display_value = findinc.u_ptgw_impacted_partners.getDisplayValue();
                affected_partners.value = findinc.getValue('u_ptgw_impacted_partners');
            } else
                affected_partners = findinc.u_ptgw_impacted_partners;

            if (findinc.u_external_systems) {
                external_systems = {};
                external_systems.display_value = findinc.u_external_systems.getDisplayValue();
                external_systems.value = findinc.getValue('u_external_systems');
            } else
                external_systems = findinc.u_external_systems;

            //Retreive Impactedsubscribers tag
            var impactedSubReturn = "";
            //		var impactedSubscribersTag = new global.TagYourIt();
            //		impactedSubReturn = impactedSubscribersTag.getTagValue(tableName, recordID, 'impacted_subscribers');	
            /* Commented out as per story - STRY0015518 */


            // ------------------- Impacted Subscribers ------------------//

            var serviceRecord = new GlideRecord("task_cmdb_ci_service");
            serviceRecord.addQuery('task', findinc.sys_id);
            serviceRecord.addQuery('cmdb_ci_service', findinc.business_service);
            serviceRecord.query();

            if (serviceRecord.next()) {
                impactedSubReturn = serviceRecord.u_estimated_subcount;
            }

            // ------------------------------------------------------------//

            ans = {
                affected_partners: affected_partners,
                alarm_notes: alarms,
                source: source,
				updated_by_system: updated_by_system,
             //   Record_URL: record_url,
                assigned_to: assigned_to,
                assignment_group: assignment_group,
                business_service: business_service,
                caller_id: caller_id,
                category: category,
                cause_code: u_cause_code,
                caused_by: caused_by,
                closed_at: closed_at,
                closed_by: closed_by,
                close_code: close_code,
                close_notes: close_notes,
                cmdb_ci: cmdb_ci,
                comments: comments,
                contact_type: contact_type,
                description: description, //STRY0017644,STRY0018677: Restrict Description field for Syndication partners
                external_system_name: external_system_name,
                external_ticket_unique_id: external_ticket_unique_id,
                external_source_url: external_source_url,
                impacted_subscribers: impactedSubReturn,
                integrated_systems: external_systems,
                knowledge: knowledge,
                mitigated: mitigated,
                number: numb,
                opened_at: opened_at,
                opened_by: opened_by,
                owner: u_ptgw_owner,
                parent_incident: parent_incident,
                partner_urgency: partner_urgency,
                priority: priority,
                priority_restoral: priority_restoral,
                problem_id: problem_id,
                resolved_at: resolved_at,
                resolved_by: resolved_by,
                resolving_partner: u_ptgw_resolving_partner,
                rfc: rfc,
                scope: scope,
                service_affect: service_affect,
                service_condition: service_condition,
                severity: severity,
                severity_scale: severity_scale,
                short_description: short_description,
                solution_code: u_solution_code,
                state: state,
                started: started,
                subcategory: subcategory,
                symptom: u_symptom,
                sys_id: sys_id,
                sys_updated_by: sys_updated_by,
                sys_updated_on: sys_updated_on,
                triaged: triaged,
                tts_ticket_id: tts_ticket_id,
                tts_status: tts_status,
                watch_list: watch_list,
                work_notes: work_notes,
                work_notes_list: work_notes_list,
                error_category: error_category,
                on_hold_reason: on_hold_reason
            };

            //STRY0017644: Restrict Description field for Syndication partners
            // STRY0018677: enable desc for ALL
            //	if(gs.getUserName() != "partner_gateway")
            ans.description = description;

            // Add related list in the Response if requested
            if (relatedList == true) {
                ans.impacted_services = impacted_services;
                ans.affected_ci = affected_ci;
                ans.outages = outages;
                ans.affected_account = affected_account;
                ans.affected_market = affected_market;
            }
            collect.push(ans);
        }
        return collect;
    },


    /** ///////////////////////////////////  Unity Get API script for change //////////////////////////////////////////////
   
   - Function is used by scripted REST API which will send one/more change request details based on the query sent in the request body.
     
	**/

    unity_get_change: function(queryParam, limitParam, offsetParam, relatedList) {
        var ans, sys_id, recordID, number, requested_by, cmdb_ci, is_bulk, category, subcategory, risk, template, type, state, service_affect, on_hold, conflict_status, conflict_last_run, assignment_group, assigned_to, additional_assignee_list, short_description, description, justification, risk_impact_analysis, pre_activity_validation, change_plan, backout_plan, test_plan, start_date, end_date, cab_required, work_start, work_end, cab_delegate, watch_list, work_notes_list, comments, work_notes, peer_reviewer_group, peer_reviewer, change_validator, technical_reviewer_group, technical_reviewer, ccb, close_code, review, close_notes, opened_at, opened_by, closed_at, closed_by, sys_updated_on, sys_updated_by, external_system_name, external_ticket_unique_id, integrated_systems, implementation_plan, state_val, approval, break_fix, impacted_partners, owner, external_source_url, parent, impacted_services, affected_ci, outages, affected_account, affected_market, change_task, multi_day_change, tts_ticket_id, tts_status, symptom_code, child_change_request, community, priority, impact, on_site_resource, on_site_contact, on_site_headend, adult_contact_impacting, cloud_bridge_url, technical_bridge, tts_sm_id, tts_procedure_id, error_category, originating_system_details, attachments = "";

        var collect = [];
        var region_id = '';
        var tableName = 'change_request';
        var limit;

        if (parseInt(limitParam) > 0)
            limit = parseInt(limitParam);
        else
            limit = 10000;

        relatedList = true; // Bring in related lists, requirement for  STRY0023573 //

        var findchg = new GlideRecord('change_request');
        findchg.addEncodedQuery(queryParam); // Pass dynamic query parameter
        findchg.setLimit(parseInt(limit));
        if (parseInt(offsetParam)) {
            findchg.chooseWindow(parseInt(offsetParam), parseInt(offsetParam) + limit);
        }
        findchg.query();
        while (findchg.next()) {
            //--------- String and Date Fields ---------------//
            sys_id = findchg.sys_id.getDisplayValue();
            recordID = findchg.sys_id;
            number = findchg.number.getDisplayValue();
            is_bulk = findchg.is_bulk.getDisplayValue();
            on_hold = findchg.on_hold.getDisplayValue();
            conflict_last_run = findchg.getValue('conflict_last_run');
            short_description = findchg.short_description.getDisplayValue();
            description = findchg.description.getDisplayValue();
            risk_impact_analysis = findchg.risk_impact_analysis.getDisplayValue();
            pre_activity_validation = findchg.u_pre_activity_validation.getDisplayValue();
            change_plan = findchg.change_plan.getDisplayValue();
            backout_plan = findchg.backout_plan.getDisplayValue();
            test_plan = findchg.test_plan.getDisplayValue();
            start_date = findchg.getValue('start_date');
            end_date = findchg.getValue('end_date');
            work_start = findchg.getValue('work_start');
            work_end = findchg.getValue('work_end');
            cab_required = findchg.cab_required.getDisplayValue();
            watch_list = findchg.watch_list.getDisplayValue();
            work_notes_list = findchg.work_notes_list.getDisplayValue();
            comments = new x_mcim_unified.UnityUtil().getJournalArray(tableName, recordID, 'u_additional_comments');
            work_notes = new x_mcim_unified.UnityUtil().getJournalArray(tableName, recordID, 'work_notes');
			watch_list = findchg.watch_list.getDisplayValue();
            review = findchg.u_review.getDisplayValue();
            close_notes = findchg.close_notes.getDisplayValue();
            justification = findchg.justification.getDisplayValue();
            opened_at = findchg.getValue('opened_at');
            closed_at = findchg.getValue('closed_at');
            close_notes = findchg.close_notes.getDisplayValue();
            sys_updated_on = findchg.getValue('sys_updated_on');
            external_system_name = findchg.correlation_display.getDisplayValue();
            external_ticket_unique_id = findchg.correlation_id.getDisplayValue();
            additional_assignee_list = findchg.additional_assignee_list.getDisplayValue();
            sys_updated_by = findchg.sys_updated_by.getDisplayValue();
            integrated_systems = findchg.u_external_systems.getDisplayValue();
            implementation_plan = findchg.implementation_plan.getDisplayValue();
            external_source_url = findchg.u_correlation_url.getDisplayValue();

            //STRY0029002 starts
            priority = findchg.getValue('priority');
            impact = findchg.getValue('impact');
            adult_contact_impacting = findchg.getValue('u_adult_content');
            cloud_bridge_url = findchg.getValue('u_cloudbridge_url');
            technical_bridge = findchg.getValue('u_technical_bridge');
            on_site_resource = findchg.getDisplayValue('u_on_site_resource');
            attachments = this.xChangeAttachment(findchg);

            //STRY0029002 ends 

            //multi_day_change=findchg.u_multi_day_change;
            tts_ticket_id = findchg.u_tts_ticket_id.getDisplayValue();
            tts_sm_id = findchg.u_tts_sm_id.getDisplayValue();
            if (findchg.u_tts_procedure_id != '') {
                tts_procedure_id = findchg.u_tts_procedure_id.getDisplayValue();
            }


            // --------------- Drop Down Fields ---------------------//
            category = findchg.getValue('category');
            subcategory = findchg.getValue('u_subcategory');
            risk = findchg.getValue('risk');
            type = findchg.getValue('type');
            state = findchg.getValue('state');
            service_affect = findchg.getValue('u_service_affect');
            close_code = findchg.getValue('close_code');
            conflict_status = findchg.getValue('conflict_status');
            tts_status = findchg.getValue('u_tts_status');
            error_category = findchg.getValue('u_error_category');
            //multi_day_change = findchg.getValue('u_multi_day_change');
            multi_day_change = findchg.u_multi_day_change.getDisplayValue();

            // ----------------Related Lists--------------------------------------//
            if (relatedList == true) {
                impacted_services = new x_mcim_unified.UnityUtil().getImpactedServices(sys_id);
                affected_ci = new x_mcim_unified.UnityUtil().getAffectedCIs(sys_id);
                outages = new x_mcim_unified.UnityUtil().getOutages(sys_id);
                affected_account = new x_mcim_unified.UnityUtil().getAffectedAccount(sys_id);
                affected_market = new x_mcim_unified.UnityUtil().getAffectedMarket(sys_id, findchg.u_primary_market.getDisplayValue());
                change_task = new x_mcim_unified.UnityUtil().getChangeTask(sys_id);
                community = new x_mcim_unified.UnityUtil().getCommunity(sys_id);

                //Get child change requests for multi night changes
                if (multi_day_change == 'true' && sys_id != '')
                    child_change_request = new x_mcim_unified.UnityUtil().getChildChangeRequest(sys_id, limitParam, offsetParam, relatedList);

            }
            //----------------------------------------------------------------------//

            if (!category)
                category = "";

            if (!subcategory)
                subcategory = "";

            if (!service_affect)
                service_affect = "";

            if (!priority)
                priority = "";

            if (!impact)
                impact = "";

            if (!state)
                state = "";

            if (!risk)
                risk = "";

            if (!type)
                type = "";

            if (!close_code)
                close_code = "";

            if (!conflict_status)
                conflict_status = "";

            // --------------- Reference fields --------------------//
            if (findchg.assigned_to) {
                assigned_to = {};
                assigned_to.display_value = findchg.assigned_to.getDisplayValue();
                assigned_to.value = findchg.getValue('assigned_to');
                assigned_to.user_name = findchg.assigned_to.user_name;
            } else
                assigned_to = findchg.assigned_to;

            if (findchg.requested_by) {
                requested_by = {};
                requested_by.display_value = findchg.requested_by.getDisplayValue();
                requested_by.value = findchg.getValue('requested_by');
                requested_by.user_name = findchg.requested_by.user_name;
                requested_by.email = findchg.requested_by.email; // added as per story STRY0015711
            } else
                requested_by = findchg.requested_by;

            if (findchg.cmdb_ci) {
                cmdb_ci = {};
                if (findchg.cmdb_ci.device_type == 'vCMTS' && findchg.cmdb_ci.sys_class_name == "cmdb_ci_netgear") {
                    cmdb_ci.display_value = findchg.cmdb_ci.fqdn;
                } else

                    cmdb_ci.display_value = findchg.cmdb_ci.name;
                cmdb_ci.value = findchg.getValue('cmdb_ci');

                // --------- Objects for Device Type, Class, and Type fields - STRY0023573 start -------------//

                cmdb_ci.sys_class_name = findchg.cmdb_ci.sys_class_name;
                if (findchg.cmdb_ci.device_type != '') {
                    cmdb_ci.device_type = findchg.cmdb_ci.device_type.getDisplayValue();
                }

                // --------- Objects for Device Type, Class, and Type fields - STRY0023573 end -------------//

                if (findchg.cmdb_ci.sys_class_name == 'cmdb_ci_endpoint') {
                    var gr = new GlideRecord('cmdb_ci_endpoint');
                    gr.addQuery('sys_id', findchg.cmdb_ci);
                    gr.query();
                    if (gr.next()) {
                        cmdb_ci.type = gr.type;
                    }
                }
                //-----------------Region ID mapping - SFSTRY0001520 Starts--------------------//
                if (findchg.u_division.toString() == '' || findchg.u_division.u_name.toString() == 'National') {
                    region_id = 'AT1000';
                } else {

                    if (findchg.cmdb_ci.sys_class_name == 'cmdb_ci_netgear') {
                        //u_cmdb_region
                        var xNetGear = new GlideRecord('cmdb_ci_netgear');
                        if (xNetGear.get(findchg.cmdb_ci.sys_id.toString())) {

                            if (xNetGear.u_cmdb_region.toString() == '') {

                                //this.xCreateProblem(findchg); //Create Problem Record

                                if (findchg.u_division.u_name.toString() == 'Northeast') {
                                    region_id = 'ME3400';
                                }
                                if (findchg.u_division.u_name.toString() == 'West') {
                                    region_id = 'MW1200';
                                }
                                if (findchg.u_division.u_name.toString() == 'Central') {
                                    region_id = 'ME1400';
                                }

                            } else if (xNetGear.u_cmdb_region.toString() != '') {
                                region_id = this.xGetRegionID(xNetGear.u_cmdb_region.toString());
                            }

                        }


                    }
                    if (region_id == '') {
                        region_id = 'AT1000';
                    }
                }


                //-----------------Region ID mapping - SFSTRY0001520 Ends--------------------//

            } else
                cmdb_ci = findchg.cmdb_ci;
            if (findchg.u_template) {
                template = {};
                template.display_value = findchg.u_template.getDisplayValue();
                template.value = findchg.getValue('u_template');
            } else
                template = findchg.u_template;

            if (findchg.assignment_group) {
                assignment_group = {};
                assignment_group.display_value = findchg.assignment_group.getDisplayValue();
                assignment_group.value = findchg.getValue('assignment_group');
                assignment_group.group_id = findchg.assignment_group.u_group_id;
                assignment_group.area_id = findchg.assignment_group.u_area_id;
            } else
                assignment_group = findchg.assignment_group;





            if (findchg.u_symptom_code) {
                symptom_code = {};
                symptom_code.display_value = findchg.u_symptom_code.getDisplayValue();
                symptom_code.value = findchg.getValue('u_symptom_code');
                symptom_code.external_id = findchg.u_symptom_code.u_external_id;

            } else
                symptom_code = findchg.u_symptom_code;


            if (findchg.u_peer_reviewer_group) {
                peer_reviewer_group = {};
                peer_reviewer_group.display_value = findchg.u_peer_reviewer_group.getDisplayValue();
                peer_reviewer_group.value = findchg.getValue('u_peer_reviewer_group');

            } else
                peer_reviewer_group = findchg.u_peer_reviewer_group;

            if (findchg.u_peer_reviewer) {
                peer_reviewer = {};
                peer_reviewer.display_value = findchg.u_peer_reviewer.getDisplayValue();
                peer_reviewer.value = findchg.getValue('u_peer_reviewer');
                peer_reviewer.user_name = findchg.u_peer_reviewer.user_name;
            } else
                peer_reviewer = findchg.u_peer_reviewer;

            //STRY0029002 starts

            if (findchg.u_on_site_headend) {
                on_site_headend = {};
                on_site_headend.display_value = findchg.u_on_site_headend.getDisplayValue();
                on_site_headend.value = findchg.getValue('u_on_site_headend');

            } else
                on_site_headend = findchg.u_on_site_headend;


            if (findchg.u_on_site_contact) {
                on_site_contact = {};
                on_site_contact.display_value = findchg.u_on_site_contact.getDisplayValue();
                on_site_contact.value = findchg.getValue('u_on_site_contact');
                on_site_contact.user_name = findchg.u_on_site_contact.user_name;
            } else
                on_site_contact = findchg.u_on_site_contact;

            //STRY0029002 ends 

            if (findchg.u_technical_reviewer_group) {
                technical_reviewer_group = {};
                technical_reviewer_group.display_value = findchg.u_technical_reviewer_group.getDisplayValue();
                technical_reviewer_group.value = findchg.getValue('u_technical_reviewer_group');
            } else
                technical_reviewer_group = findchg.u_technical_reviewer_group;

            if (findchg.u_techical_reviewers) {
                technical_reviewer = {};
                technical_reviewer.display_value = findchg.u_techical_reviewers.getDisplayValue();
                technical_reviewer.value = findchg.getValue('u_techical_reviewers');
                technical_reviewer.user_name = findchg.u_techical_reviewers.user_name;
            } else
                technical_reviewer = findchg.u_techical_reviewers;

            if (findchg.u_change_validator) {
                change_validator = {};
                change_validator.display_value = findchg.u_change_validator.getDisplayValue();
                change_validator.value = findchg.getValue('u_change_validator');
                change_validator.user_name = findchg.u_change_validator.user_name;
            } else
                change_validator = findchg.u_change_validator;

            if (findchg.parent) {
                parent = {};
                parent.display_value = findchg.parent.getDisplayValue();
                parent.value = findchg.getValue('parent');
            } else
                parent = findchg.parent;

            if (findchg.opened_by) {
                opened_by = {};
                opened_by.display_value = findchg.opened_by.getDisplayValue();
                opened_by.value = findchg.getValue('opened_by');
                opened_by.user_name = findchg.opened_by.user_name;
            } else
                opened_by = findchg.opened_by;

            if (findchg.u_ccb) {
                ccb = {};
                ccb.display_value = findchg.u_ccb.getDisplayValue();
                ccb.value = findchg.getValue('u_ccb');
            } else
                ccb = findchg.u_ccb;

            if (findchg.cab_delegate) {
                cab_delegate = {};
                cab_delegate.display_value = findchg.cab_delegate.getDisplayValue();
                cab_delegate.value = findchg.getValue('cab_delegate');
                cab_delegate.user_name = findchg.cab_delegate.user_name;
            } else
                cab_delegate = findchg.cab_delegate;

            if (findchg.closed_by) {
                closed_by = {};
                closed_by.display_value = findchg.closed_by.getDisplayValue();
                closed_by.value = findchg.getValue('closed_by');
                closed_by.user_name = findchg.closed_by.user_name;
            } else
                closed_by = findchg.closed_by;

            if (findchg.u_ptgw_owner) {
                owner = {};
                owner.display_value = findchg.u_ptgw_owner.getDisplayValue();
                owner.value = findchg.getValue('u_ptgw_owner');
            } else
                owner = findchg.u_ptgw_owner;

            if (findchg.u_impacted_partners) {
                var refVal = findchg.u_impacted_partners.toString();
                var DisVal = findchg.u_impacted_partners.getDisplayValue().toString();
                impacted_partners = {};
                impacted_partners.display_value = DisVal; //findchg.u_impacted_partners.getDisplayValue();
                impacted_partners.value = refVal; //findchg.getValue('u_impacted_partners');
            } else
                impacted_partners = findchg.u_impacted_partners;

            //------------------------Set Approval value-----------------------------------
            state_val = findchg.getValue('state');
            if (state_val == '-3')
                approval = 'requested';
            else if (state_val == '-2' || state_val == '-1' || state_val == '0' || state_val == '30' || state_val == '3')
                approval = 'approved';
            else
                approval = '';

            //------------------------------------------------------------------------------
            //check and see if there are records within the 'Incidents Pending Change' related list for the current change request
            break_fix = 'false';
            var findinc = new GlideRecord('incident');
            findinc.addQuery('rfc', findchg.sys_id);
            findinc.query();
            if (findinc.next()) {
                break_fix = 'true';
            }


            //-------------------------------Originating Sytem Details----------------------------------------------
            var xOrgSystems = [];

            var xOrg = new GlideRecord('u_originating_system_details');
            xOrg.addQuery('u_parent', findchg.sys_id.toString());
            xOrg.query();
            while (xOrg.next()) {
                var xOrgJson = {};
                xOrgJson.u_source_job_name = xOrg.u_source_job_name.toString();
                xOrgJson.u_source_platform = xOrg.u_source_platform.toString();
                xOrgJson.u_source_job_link = xOrg.u_source_job_link.toString();
                xOrgJson.u_additional_links = xOrg.u_additional_links.toString();
                xOrgJson.u_source_job_id = xOrg.u_source_job_id.toString();
                xOrgJson.u_source_job_sub_id = xOrg.u_source_job_sub_id.toString();
                xOrgJson.u_source_system = xOrg.u_source_system.toString();
                xOrgJson.sys_updated_on = xOrg.sys_updated_on.toString();
                xOrgJson.sys_created_on = xOrg.sys_created_on.toString();


                xOrgSystems.push(xOrgJson);

            }
            //-------------------------------Originating Sytem Details ENDS----------------------------------------------



            //---------------------Set answer----------------------------------------------
            ans = {
                number: number,
                approval: approval,
                break_fix: break_fix,
                requested_by: requested_by,
                cmdb_ci: cmdb_ci,
                region_id: region_id, //Added as part of SFSTRY0001520
                is_bulk: is_bulk,
                category: category,
                subcategory: subcategory,
                risk: risk,
                template: template,
                type: type,
                state: state,
                service_affect: service_affect,
                on_hold: on_hold,
                conflict_status: conflict_status,
                conflict_last_run: conflict_last_run,
                assignment_group: assignment_group,
                assigned_to: assigned_to,
                additional_assignee_list: additional_assignee_list,
                short_description: short_description,
                description: description, //Was earlier restricted by STRY0017644. Now re-enabled by STRY0023183. Relay should restrict this for non sky partners
                justification: justification,
                impacted_partners: impacted_partners,
                implementation_plan: implementation_plan,
                risk_impact_analysis: risk_impact_analysis,
                parent: parent,
                pre_activity_validation: pre_activity_validation,
                change_plan: change_plan,
                backout_plan: backout_plan,
                test_plan: test_plan,
                start_date: start_date,
                end_date: end_date,
                cab_required: cab_required,
                work_start: work_start,
                work_end: work_end,
                cab_delegate: cab_delegate,
                watch_list: watch_list,
                work_notes_list: work_notes_list,
                comments: comments,
                work_notes: work_notes,
                peer_reviewer_group: peer_reviewer_group,
                peer_reviewer: peer_reviewer,
                change_validator: change_validator,
                technical_reviewer_group: technical_reviewer_group,
                technical_reviewer: technical_reviewer,
                ccb: ccb,
                owner: owner,
                symptom: symptom_code,
                close_code: close_code,
                review: review,
                close_notes: close_notes,
                opened_at: opened_at,
                opened_by: opened_by,
                closed_at: closed_at,
                closed_by: closed_by,
                sys_id: sys_id,
                sys_updated_on: sys_updated_on,
                sys_updated_by: sys_updated_by,
                tts_ticket_id: tts_ticket_id,
                tts_status: tts_status,
                tts_sm_id: tts_sm_id,
                external_system_name: external_system_name,
                external_ticket_unique_id: external_ticket_unique_id,
                external_source_url: external_source_url,
                integrated_systems: integrated_systems,
                multi_day_change: multi_day_change,
                community: community,
                tts_procedure_id: tts_procedure_id,

                priority: priority, //STRY0029002 starts
                impact: impact,
                on_site_resource: on_site_resource,
                on_site_contact: on_site_contact,
                on_site_headend: on_site_headend,
                adult_contact_impacting: adult_contact_impacting,
                cloud_bridge_url: cloud_bridge_url,
                technical_bridge: technical_bridge,
                originating_system_details: xOrgSystems,
                attachments: attachments //STRY0029002 ends 

            };

            //STRY0017644: Restrict Description field for Syndication partners
            //if(gs.getUserName() != "partner_gateway")  //Now re-enabled by STRY0023183
            ans.description = description;

            // Add related list in the Response if requested
            if (relatedList == true) {
                ans.impacted_services = impacted_services;
                ans.affected_ci = affected_ci;
                ans.outages = outages;
                ans.affected_account = affected_account;
                ans.affected_market = affected_market;
                ans.change_task = change_task;

                //Return Child change requests only for Multi night change requests
                if (multi_day_change == 'true' && sys_id != '')
                    ans.child_change_requests = child_change_request;

            }
            collect.push(ans);
        }
        return collect;
    },


    // This function will return the array of journal entries for a given field.
    // The elements returned per journal record are: Journal Entry Value, Journal Entry Date, Creator of Journal Entry
    // To call this function, three attributes are required, Table Name, the sysID of table record, and the specific journal field to query (e.g., comments, work_notes)
    getJournalArray: function(tableName, recordID, journalField) {
        // Initialize temporary variables
        var JournalArray = [];
        var userRecord = new GlideRecord('sys_user');
        // Query the sys_journal_field tabel
        var gr = new GlideRecord('sys_journal_field');
        gr.addQuery('name', tableName);
        gr.addQuery('element_id', recordID);
        gr.addQuery('element', journalField);
        gr.orderBy('sys_created_on');
        gr.query();
        // Push every journal entry into the JournalArray
        // Contents should include journal entry, date posted, and user who posted journal entry
        while (gr.next()) {
            userRecord.get('user_name', gr.sys_created_by);
            JournalArray.push({
                value: gr.value.toString(),
                posted_on: gr.getValue('sys_created_on'),
                posted_by_user_id: gr.sys_created_by.toString(),
                posted_by_name: userRecord.name.toString(),
            });
        }

        // Return complete array
        return JournalArray;
    },
    // Story STRY0018047 starts Get Community
    getCommunity: function(sys_id) {
        var xCommunity = [];
        var arr1 = [];
        var xCommunity_unique = '';
        var xCom = new GlideRecord('task_cmdb_ci_service');
        xCom.addQuery('task', sys_id);
		xCom.addEncodedQuery('u_communityISNOTEMPTY^task.sys_class_name=change_request'); //Limiting query to not include empty
        xCom.query();
        while (xCom.next()) {

            arr1 = xCom.u_community.getDisplayValue().split(",");
            for (var s = 0; s < arr1.length; s++) {
                xCommunity.push(arr1[s]);
            }

        }
        //xCommunity_unique = this._xDuplicates(xCommunity); //Commented out as part of SFSTRY0002290
		
		var xArr = new global.ArrayUtil(); //using OOB unique method.
        xCommunity_unique = xArr.unique(xCommunity);
		
        return xCommunity_unique.toString();
        //return string Value of Community;
    },
	/* //Commenting out as part of SFSTRY0002290 using OOB unique method.
    _xDuplicates: function(arr) {
        var unique_array = [];
        for (i = 0; i < arr.length; i++) {
            if (unique_array.indexOf(arr[i]) == -1) {
                unique_array.push(arr[i]);
            }
        }
        return unique_array;
    },*/
    //Story STRY0018047 Ends



    //STRY0029002 attachments starts 


    xChangeAttachment: function(current) {

        var xAttachment = [];


        var xAr = new GlideRecord('sys_attachment');
        xAr.addQuery('table_sys_id', current.sys_id.toString());
        xAr.addQuery('table_name', 'change_request');
        xAr.query();
        while (xAr.next()) {
            var xReqBody = {};
            xReqBody.attachment_name = xAr.file_name.toString();
            xReqBody.attachment_sys_id = xAr.sys_id.toString();
            xReqBody.attachment_content_type = xAr.content_type.toString();


            xAttachment.push(xReqBody);

        }

        return xAttachment;
    },

    //STRY0029002 attachments ends 

    //-----------------Region ID mapping - SFSTRY0001520 Starts--------------------//

    xGetRegionID: function(xRegion) {
        var xMarket = new GlideRecord('u_comcast_market');
        xMarket.addEncodedQuery('u_type=Region^u_active=true^u_name=' + xRegion);
        xMarket.query();
        if (xMarket.next()) {
            return xMarket.u_id.toString();
        } else {
            return '';
        }
    },

    /*xCreateProblem: function(findchg) {
        var xPr = new GlideRecord('problem');
        xPr.addEncodedQuery('first_reported_by_task=' + findchg.sys_id.toString());
        xPr.query();
        if (!xPr.next()) {
            xPr.initialize();
            xPr.first_reported_by_task = findchg.sys_id.toString();
            xPr.assignment_group = gs.getProperty('configmgmtgroupsysid');
            xPr.description = 'Region ID for CI: ' + findchg.cmdb_ci.name.toString() + ' is empty';
            xPr.short_description = 'Region ID for CI: ' + findchg.cmdb_ci.name.toString() + ' is empty';
            xPr.cmdb_ci = findchg.cmdb_ci.sys_id.toString();
            xPr.u_problem_source = 'change';
            xPr.insert();

        }
    },*/

    //-----------------Region ID mapping - SFSTRY0001520 Ends--------------------//


    /////////FUNCTIONS TO RETRIEVE RELATED LISTS//////////////
    getImpactedServices: function(sys_id) { //Impacted services related list
        var impact_serv_array = [];
        var impact_serv = new GlideRecord('task_cmdb_ci_service');
        impact_serv.addQuery('task', sys_id);
        impact_serv.query();
        while (impact_serv.next()) {
            impact_serv_array.push({
                cmdb_ci_service: impact_serv.cmdb_ci_service.getDisplayValue().toString(),
                service_condition: impact_serv.u_service_condition.toString(),
                severity_scale: impact_serv.u_severity_scale.toString(),
                description: impact_serv.u_description.toString(),
                estimated_subcount: impact_serv.u_estimated_subcount.toString(),
                service_name: impact_serv.cmdb_ci_service.name.toString(),
                service_class: impact_serv.cmdb_ci_service.u_service_class.toString(),
                external_service_name: impact_serv.cmdb_ci_service.u_external_service_name.toString(),
                sys_id: impact_serv.sys_id.toString(),
                community: impact_serv.u_community.getDisplayValue().toString()

            });

        }
        return impact_serv_array;
    },
    getAffectedCIs: function(sys_id) { //Affected CI related list
        var affect_ci_array = [];
        var type = '';
        var ci = '';
        var affect_ci = new GlideRecord('task_ci');
        affect_ci.addQuery('task', sys_id);
        affect_ci.query();

        while (affect_ci.next()) {

            // --------- Retrieve Endpoint data - STRY0023573 start -------------//

            if (affect_ci.ci_item.sys_class_name == "cmdb_ci_endpoint") {

                var gr = new GlideRecord("cmdb_ci_endpoint");
                gr.addQuery("sys_id", affect_ci.ci_item);
                gr.query();
                if (gr.next()) {
                    type = gr.type.toString();
                }
            }
            if (affect_ci.ci_item.sys_class_name == "cmdb_ci_netgear" && affect_ci.ci_item.device_type == 'vCMTS') {
                ci = affect_ci.ci_item.fqdn;
            } else {
                ci = affect_ci.ci_item.name;
            }

            // --------- Retrieve Endpoint data - STRY0023573 end -------------//

            affect_ci_array.push({
                ci_item: ci,
                //GL Code for Affected CI
                u_gl_code: affect_ci.ci_item.u_gl_code.toString(),

                // --------- Objects for Device Type, Class and Type fields - STRY0023573 start -------------//

                device_type: affect_ci.ci_item.device_type.toString(),
                sys_class_name: affect_ci.ci_item.sys_class_name.getDisplayValue().toString(),
                type: type,

                // --------- Objects for Device Type, Class and Type fields - STRY0023573 end -------------//

                sys_id: affect_ci.sys_id.toString(),
                affected_system: this._getRelAffectedSystem(sys_id, affect_ci.getValue('ci_item')),
                affected_market: this._getRelAffectedMarket(sys_id, affect_ci.getValue('ci_item'))
            });

        } //gs.info('sysid'+affect_ci_array);
        return affect_ci_array;
    },

    getOutages: function(sys_id) { //Impacted services related list
        var outage_array = [];
        var ci = '';
        var outage = new GlideRecord('cmdb_ci_outage');
        outage.addQuery('task_number', sys_id);
        outage.query();
        while (outage.next()) {
            if (outage.cmdb_ci.sys_class_name == "cmdb_ci_netgear" && outage.cmdb_ci.device_type == 'vCMTS') {
                ci = outage.cmdb_ci.fqdn;
            } else {
                ci = outage.cmdb_ci.name;
            }
            outage_array.push({
                cmdb_ci: ci,
                type: outage.type.toString(),
                begin: outage.getValue('begin'),
                end: outage.getValue('end'),
                sys_id: outage.sys_id.toString(),
                affected_system: this._getRelAffectedSystem(sys_id, outage.getValue('cmdb_ci')),
                affected_market: this._getRelAffectedMarket(sys_id, outage.getValue('cmdb_ci')),
                u_gl_code: outage.cmdb_ci.u_gl_code
            });

        }
        return outage_array;
    },

    getAffectedAccount: function(sys_id) { //Impacted services related list
        var affectedacct_array = [];
        var affectacct = new GlideRecord('u_m2m_tasks_accounts');
        affectacct.addQuery('u_task', sys_id);
        affectacct.query();
        while (affectacct.next()) {
            affectedacct_array.push({
                account: affectacct.u_account.getDisplayValue().toString(),
                sys_id: affectacct.sys_id.toString(),

            });

        }
        return affectedacct_array;
    },
    //Changing object of affected markets as per STRY0017103
    // this object has been changed to sent system with markets so that approriate correlation happens in TTS
    getAffectedMarket: function(sys_id, primary_market) { //Impacted markets related list
        var market_array = [];
        var system_array = [];
        var market = new GlideRecord('u_m2m_tasks_comcast_markets');
        market.addQuery('u_task', sys_id);
        market.query();
        while (market.next()) {
            if (market.u_comcast_market.u_type == 'System') {
                system_array.push(market.u_comcast_market.u_id);
                market_array.push(market.u_comcast_market.u_parent.u_id);
            } else {
                market_array.push(market.u_comcast_market.u_id);
            }
        }
        var au = new global.ArrayUtil();
        market_array = au.unique(market_array);
        var affected_market_obj = {
            comcast_market: primary_market,
            system_id: system_array,
            market_id: market_array
        };
        return affected_market_obj;
    },

    getChangeTask: function(sys_id) { //Change tasks related list
        var task_array = [];
        var chgTask = new GlideRecord('change_task');
        chgTask.addQuery('change_request', sys_id);
        chgTask.query();
        while (chgTask.next()) {
            task_array.push({
                assigned_to: chgTask.assigned_to.getDisplayValue().toString(),
                assignment_group: chgTask.assignment_group.getDisplayValue().toString(),
                short_description: chgTask.short_description.toString(),
                sys_id: chgTask.sys_id.toString(),
            });
        }
        return task_array;
    },
    //Get all child change requests
    getChildChangeRequest: function(sys_id, limitParam, offsetParam, relatedList) {
        var child_change_request = [];
        var childquery, queryResults = '';
        var chCR = new GlideRecord('change_request');
        chCR.addQuery('parent', sys_id);
        chCR.query();
        while (chCR.next()) {
            childquery = 'sys_id=' + chCR.getValue('sys_id');
            queryResults = new x_mcim_unified.UnityUtil().unity_get_change(childquery, limitParam, offsetParam, relatedList);
            child_change_request.push({
                change_details: queryResults
            });
        }
        return child_change_request;
    },
    _getRelAffectedMarket: function(task, ci) {
        var markGr = new GlideRecord('u_m2m_tasks_comcast_markets');
        markGr.addEncodedQuery('u_task.sys_id=' + task + '^u_related_ciLIKE' + ci + '^u_comcast_market.u_type=Region');
        markGr.query();
        var marketArray = [];
        while (markGr.next()) {
            marketArray.push(markGr.u_comcast_market.u_id);
        }
        return marketArray;
    },
    _getRelAffectedSystem: function(task, ci) {
        var systemGr = new GlideRecord('u_m2m_tasks_comcast_markets');
        systemGr.addEncodedQuery('u_task.sys_id=' + task + '^u_related_ciLIKE' + ci + '^u_comcast_market.u_type=System');
        systemGr.query();
        var systemArray = [];
        while (systemGr.next()) {
            systemArray.push(systemGr.u_comcast_market.u_id);
        }
        return systemArray;
    },
    type: 'UnityUtil'
};