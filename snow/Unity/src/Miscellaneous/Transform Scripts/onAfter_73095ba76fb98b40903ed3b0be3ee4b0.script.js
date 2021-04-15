(function runTransformScript(source, map, log, target /*undefined onStart*/ ) {
	var table = 'incident';
	var rec = target.sys_id;
	var attribute = 'urgency';
	var val = source.partner_urgency;
	
	if(val.indexOf('1') > -1)
		val = '1';
	else if(val.indexOf('2') > -1)
		val = '2';
	else if(val.indexOf('3') > -1)
		val = '3';
	else if(val.indexOf('4') > -1)
		val = '4';
	
	var tag = new global.TagYourIt();
	tag.tagRecord(table,rec,attribute,val);
	
	// If only tags are updated in this import, we set the import state to updated. Otherwise response will be misleading
	if (source.sys_import_state == 'ignored' && source.partner_urgency != '') {
		source.sys_import_state = 'updated';
		source.status_message = '';
	}
	
	
})(source, map, log, target);