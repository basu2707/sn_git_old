(function runTransformScript(source, map, log, target /*undefined onStart*/ ) {


	if(source.u_primary_service !='' ){
		
		var cas =new GlideRecord('sn_customerservice_case1');
		cas.addQuery('sys_id',target.sys_id); 
		cas.query();
		
		if(cas.next())
			{
			if(target.u_primary_service=='' && source.u_primary_service !='') //If no match is found for CI
				cas.work_notes="Primary Service is not available in servicenow : "+source.u_primary_service;
	
			cas.update();
	
		}
		
	}

})(source, map, log, target);