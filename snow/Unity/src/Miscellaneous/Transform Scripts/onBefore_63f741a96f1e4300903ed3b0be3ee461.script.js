(function runTransformScript(source, map, log, target /*undefined onStart*/ ) {
	// Contact Type should only be defined on Insert
	if (action == "update") {
		source.contact_type = target.contact_type;
		return;
	}
	
	// If Contact Type is Not Provided, Default to Integration
	if (!source.contact_type)
		source.contact_type = 'Integration';
})(source, map, log, target);