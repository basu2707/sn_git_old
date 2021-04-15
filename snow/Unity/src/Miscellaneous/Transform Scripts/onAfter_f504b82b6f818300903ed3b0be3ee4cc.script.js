(function runTransformScript(source, map, log, target /*undefined onStart*/ ) {
	
	//////////////////////////////////////////////////////////////////
	// Made Inactive and commented out based on story - STRY0015518///
	//////////////////////////////////////////////////////////////////
	
	/*
	var table = 'incident';
	var rec = target.sys_id;
	var attribute = 'impacted_subscribers';
	var val = source.impacted_subscribers;
	
	//Exit if val is invalid
	if (!val || (val >= 0) == false)
		return;
	
	var tag = new global.TagYourIt();
	var tagValue = tag.getTagValue(table,rec,attribute);
	
	//Check if the value tagged is same as that of val from source,
	if ((tagValue != val) || (tagValue == ''))
		{
		var tagLabel = tag.getLabelID(attribute,val);
		//Check if Label for that attribute is present,else create a new label
		if ((tagLabel == undefined) || (tagLabel == ''))
			{
			tag.createNewLabel(attribute,val);
			tag.tagRecord(table,rec,attribute,val);
		}
		else
			tag.tagRecord(table,rec,attribute,val);

// If only 'impacted_subscribers' are updated in this import, set the import_state=updated, else response will be misleading
		if (source.sys_import_state == 'ignored' && source.impacted_subscribers != '') {
			source.sys_import_state = 'updated';
			source.status_message = '';
		}
	}
	else if(tagValue == val)
			return;
		*/
})(source, map, log, target);