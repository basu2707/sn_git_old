(function runTransformScript(source, map, log, target /*undefined onStart*/ ) {

	var ON_HOLD_REASON_SOAKING = 5;
	// Add your code here
	if(source.u_soak_incident == true || source.u_soak_incident == True)
		{
			target.state = 3; // on hold
			target.hold_reason = ON_HOLD_REASON_SOAKING;
			target.update();
		}

})(source, map, log, target);