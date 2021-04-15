(function runTransformScript(source, map, log, target /*undefined onStart*/ ) {
	// Exit Function if Ignore/Error or Additional Affected Market not Provided
	if (ignore == true || error == true || source.affected_markets.nil())
		return;
	
	var AMString = source.affected_markets.toString();
	var AMArray = AMString.split(",");
	var gr = new GlideRecord('u_m2m_tasks_comcast_markets');
	var AMID;
	
	// Go Through Each Affected Market Provided, Check for Exisitng Affected Market, and Create Record
	for (var i = 0; i < AMArray.length; i++) {
		AMID = getMarketsysid(AMArray[i]);
		
		if (AMID) {
			if (!checkExistingAffectedMarket(AMID)) {
				gr.initialize();
				gr.u_task = target.sys_id;
				gr.u_comcast_market = AMID;
				gr.insert();
			}
		}
	}
	
	// Supporting Function to Return SYS ID of Given Affected Market
	function getMarketsysid(val) {
		
		if(val != '') // Find Market only if a value is provided.
			{
			var MRqueryString = 'u_id='+val+'^ORu_name='+val;
			var gr = new GlideRecord('u_comcast_market');
			gr.addEncodedQuery(MRqueryString);
			gr.query();
			
			if (gr.next())
				return gr.sys_id;
			else
				return null;
		}
		else
			return null;
	}
	
	// Supporting Function to Check if Affected Market is Already Populated
	function checkExistingAffectedMarket(sysID) {
		var gr = new GlideRecord('u_m2m_tasks_comcast_markets');
		gr.addQuery('u_task', target.sys_id);
		gr.addQuery('u_comcast_market', sysID);
		gr.query();
		
		if (gr.next())
			return true;
		else
			return false;
	}
})(source, map, log, target);