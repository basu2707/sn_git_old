(function runTransformScript(source, map, log, target /*undefined onStart*/ ) {

	if (action == 'insert') {
		error = true;
		error_message = "Creation of new record is not allowed through this API. Either you number/external_unique_id is not matching with existing ones in IOP";
		ignore = true;
	}
	  

})(source, map, log, target);