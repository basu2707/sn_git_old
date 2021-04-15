(function runTransformScript(source, map, log, target /*undefined onStart*/ ) {


	
		var cas =new GlideRecord('sn_customerservice_case1');
		cas.addQuery('sys_id',target.sys_id); 
		cas.query();
		
		if(cas.next())
			{
				if(source.u_assignment_group !='' ){
			if(target.assignment_group=='' && source.u_assignment_group!=''){ //If no match is found for CI
				cas.work_notes="Asisgnment group is not available in servicenow : "+source.u_assignment_group;
					cas.update();
			}
				}
				if(source.u_affected_application !='' ){
			if(target.cmdb_ci=='' && source.u_affected_application!='') {//If no match is found for CI
				cas.work_notes="Device is not available in servicenow : "+source.u_affected_application;
					cas.update();
	
			}}
				if(source.u_symptom !='' ){
					if(target.u_symptom=='' && source.u_symptom!=''){ //If no match is found for CI
				cas.work_notes="Symptom is not available in servicenow : "+source.u_symptom;
						cas.update();
	
					}
		}
		
		
	
			}


})(source, map, log, target);