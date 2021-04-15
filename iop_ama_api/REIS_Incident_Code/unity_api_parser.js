%dw 2.0
output application/json
skipNullOn = "everywhere"
fun normalizeDate(date) = (date replace " " with "T") as LocalDateTime default null
var response = {
	incidents: vars.unityResponse.data.inc map ( inc , indexOfInc ) -> {
			integrated_systems: inc.integrated_systems ,
	caused_by: inc.caused_by ,
	watch_list: inc.watch_list ,
	impacted_services: inc.impacted_services,
	impacted_subscribers: inc.impacted_subscribers ,
	sys_updated_on: normalizeDate(inc.sys_updated_on),
	priority_restoral: inc.priority_restoral ,
	tts_status: inc.tts_status ,
	number: inc.number ,
	partner_urgency: inc.partner_urgency ,
	affected_market: inc.affected_market ,
	resolved_by: inc.resolved_by ,
	sys_updated_by: inc.sys_updated_by ,
	opened_by: inc.opened_by ,
	external_ticket_unique_id: inc.external_ticket_unique_id ,
	state: inc.state ,
	knowledge: inc.knowledge ,
	triaged: normalizeDate(inc.triaged),
	closed_at: normalizeDate(inc.closed_at),
	cmdb_ci: if(inc.cmdb_ci == null or inc.cmdb_ci == "") null else {
		name: inc.cmdb_ci.display_value ,
		id: inc.cmdb_ci.value
		},
	severity_scale: inc.severity_scale ,
	outages: inc.outages map ( outage , indexOfOutage ) -> {
		sys_id: outage.sys_id ,
		affected_market: outage.affected_market map ( affectedmarket , indexOfAffectedmarket ) -> affectedmarket,
		cmdb_ci: outage.cmdb_ci ,
		end: normalizeDate(outage.end) ,
		"type": outage."type" ,
		affected_system: outage.affected_system map ( affectedsystem , indexOfAffectedsystem ) -> affectedsystem,
		begin: normalizeDate(outage.begin) 
	} ,
	work_notes_list: inc.work_notes_list ,
	business_service: inc.business_service ,
	priority: inc.priority ,
	rfc: inc.rfc ,
	affected_ci: inc.affected_ci,
	opened_at: normalizeDate(inc.opened_at),
	symptom: inc.symptom,
	caller_id: inc.caller_id ,
	resolved_at: normalizeDate(inc.resolved_at),
	subcategory: inc.subcategory ,
	work_notes: inc.work_notes map ( worknote , indexOfWorknote ) -> {
		posted_on:normalizeDate(worknote.posted_on),
		posted_by_user_id:worknote.posted_by_user_id,
		posted_by_name:worknote.posted_by_name,
		value:worknote.value	
	} ,
	short_description: inc.short_description ,
	close_code: inc.close_code ,
	assignment_group: inc.assignment_group,
	description: inc.description ,
	solution_code: inc.solution_code,
	close_notes: inc.close_notes ,
	closed_by: inc.closed_by ,
	affected_account: inc.affected_account ,
	parent_incident: inc.parent_incident ,
	sys_id: inc.sys_id ,
	contact_type: inc.contact_type ,
	problem_id: inc.problem_id ,
	service_affect: inc.service_affect ,
	affected_partners: inc.affected_partners ,
	scope: inc.scope ,
	assigned_to: inc.assigned_to  ,
	mitigated: normalizeDate(inc.mitigated),
	owner: inc.owner ,
	severity: inc.severity ,
	external_source_url: inc.external_source_url ,
	comments: inc.comments map ( comment , indexOfComment ) -> {
	posted_on:normalizeDate(comment.posted_on),
	posted_by_user_id:comment.posted_by_user_id,
	posted_by_name:comment.posted_by_name,
	value:comment.value	
	} ,
	started: normalizeDate(inc.started),
	external_system_name: inc.external_system_name ,
	alarm_notes: inc.alarm_notes map ( alarm_note , indexOfNote ) -> {
	posted_on:normalizeDate(alarm_note.posted_on),
	posted_by_user_id:alarm_note.posted_by_user_id,
	posted_by_name:alarm_note.posted_by_name,
	value:alarm_note.value	
	},
	cause_code: inc.cause_code,
	service_condition: inc.service_condition ,
	resolving_partner: inc.resolving_partner ,
	category: inc.category ,
	u_tts_log: inc.u_tts_log,
	tts_ticket_id: inc.tts_ticket_id,
	source: inc.source
}}
---
{
	transaction_id: correlationId,
	success: true,
	data: if(vars.unityResponse.data.inc[1] != null)
		response
		else {
			incident:response.incidents[0]
		}
		}