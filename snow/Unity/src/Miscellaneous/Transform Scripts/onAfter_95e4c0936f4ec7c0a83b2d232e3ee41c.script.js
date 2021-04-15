(function runTransformScript(source, map, log, target /*undefined onStart*/ ) {
	// Exit Function if Ignore/Error or Additional Affected CI not Provided
	if (ignore == true || error == true || source.affected_cis.nil())
		return;
	
	var ciString = source.affected_cis.toString();
	var ciArray = ciString.split(",");
	var gr = new GlideRecord('task_ci');
	var ciID;
	
	// Go Through Each Affected CI Provided, Check for Exisitng Affected CI, and Create Record
	for (var i = 0; i < ciArray.length; i++) {
		ciID = getCIsysid(ciArray[i]);
		
		if (ciID) {
			if (!checkExistingAffectedCI(ciID)) {
				gr.initialize();
				gr.task = target.sys_id;
				gr.ci_item = ciID;
				gr.insert();
			}
		}
	}
	
	// Supporting Function to Return SYS ID of Given Affected CI
	function getCIsysid(ciName) {
		var gr = new GlideRecord('cmdb_ci');
		gr.addQuery('name', ciName);
		gr.query();
		
		if (gr.next())
			return gr.sys_id;
		else 
			return null;
	}
	
	// Supporting Function to Check if Affected CI is Already Populated
	function checkExistingAffectedCI(sysID) {
		var gr = new GlideRecord('task_ci');
		gr.addQuery('task', target.sys_id);
		gr.addQuery('ci_item', sysID);
		gr.query();
		
		if (gr.next())
			return true;
		else
			return false;
	}
})(source, map, log, target);