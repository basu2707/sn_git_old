(function runTransformScript(source, map, log, target /*undefined onStart*/ ) {

	// Add your code here
	
	if (source.external_systems_integrated.toString() == "Remedy TTS"){
		if (target.u_external_systems.indexOf("Remedy TTS")<= -1){
			target.u_external_systems += ',Remedy TTS';
		}
		
	}
	if (source.external_systems_integrated.toString() == 'Partner Gateway'){
		if (target.u_external_systems.indexOf('Partner Gateway')<= -1){
			target.u_external_systems += ',Partner Gateway';
		}
		
	}

})(source, map, log, target);