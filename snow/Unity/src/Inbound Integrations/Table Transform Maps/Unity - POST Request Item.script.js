(function transformRow(source, target, map, log, isUpdate) {
	var attachment_status = '';
	
	//This script ensures that External system Name (correlation_display) and External system ID (correlation_id) are never overridden once filled.   
	
	var external_id=source.external_ticket_unique_id; // External ticket unique id and external system name from source table
	var external_name=source.external_system_name;
	
    var ritm= new GlideRecord('sc_req_item');
	ritm.addQuery('sys_id',target.sys_id);
	ritm.query();
	if(ritm.next())
	{
		
// 	//gs.info("Loop outside" +chg.u_tts_ticket+  "status " +chg.u_tts_status + "External sytems" +chg.u_external_systems  +chg.number);
// 		//if(source.sys_created_by == 'tts_snow'){
// 		if((ritm.u_tts_ticket != '' || ritm.u_tts_status !='') && (chritmg.u_external_systems.getDisplayValue().indexOf("Remedy TTS") < 0))
// 			{
// 				//gs.info("Loop inside"+chg.number);
// 				target.u_external_systems += ",Remedy TTS";
// 				//gs.info("LOOP UPDATED EXTERNAL SYSTEMS" +chg.u_external_systems +chg.number);
// 			}
// 	//	}
		
		if(ritm.correlation_id=='')      //If correlation id of the record is empty,
				target.correlation_id = external_id; //then update the record with the new value from source table
		else
			if(source.sys_created_by != 'partner_gateway'){
				target.correlation_id = ritm.correlation_id;
			}//else prevent overriding
        
		if(ritm.correlation_display=='') //If correlation display of the record is empty
			target.correlation_display = external_name; //then update the record with the new value from source table
		else
			target.correlation_display = ritm.correlation_display; //else prevent overriding	
		
		//Updating now date and time
	
  }
})(source, target, map, log, action==="update");