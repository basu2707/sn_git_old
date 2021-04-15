(function runTransformScript(source, map, log, target /*undefined onStart*/ ) {

	// This code is used to update variables in RITM
	for(var key in source){
		if(key.toString().startsWith('variable')){
			var var_length = key.length;
			var var_name = key.substring(9,var_length+1);
			target.variables[var_name] = source[key];
		}
	}

})(source, map, log, target);