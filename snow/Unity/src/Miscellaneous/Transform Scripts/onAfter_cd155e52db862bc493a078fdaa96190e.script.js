(function runTransformScript(source, map, log, target /*undefined onStart*/ ) {

	// Return if Ignore/Error
	if (ignore == true || error == true)
		return;

	// Return if Change state is not closed(3) and not Cancelled(4)	
	var state = target.state;
	if (state != 3 && state != 4)
		return;

	// Complete the Change Tasks based on Closure/Cancellation of the Change.
	var gr = new GlideRecord("change_task");
	gr.addQuery("change_request",target.sys_id);
	gr.addQuery("active",true);
	gr.query();
	if (gr.next()) 
	{
		if(state == 3)
		{
			gr.state = 3;
			gr.update();
		}
		else if(state == 4)
		{
			gr.state = 4;
			gr.update();
		}
	}

})(source, map, log, target);