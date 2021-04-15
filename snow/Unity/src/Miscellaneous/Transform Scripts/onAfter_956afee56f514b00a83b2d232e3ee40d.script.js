(function runTransformScript(source, map, log, target /*undefined onStart*/ ) {
	
	// WE had to deactivate this functionality since we had issues with the size of the binary code.
	// Alternate is to use SNOW attachment API, suggested by SNOW in HI - INT3548135
	
/*	if (ignore != true && error != true && source.attachment_name && source.attachment_payload) {
		
		var table = 'change_request';
		var id = target.sys_id;
		var name = source.attachment_name;
		var content = '';
		var queueID = '';
		
		// Using ECC QUEUE, convert the base64 format content to files and attach to the Change
		
		var gr = new GlideRecord('ecc_queue');
		gr.initialize();
		gr.agent = "AttachmentCreator";
		gr.topic = "AttachmentCreator";
		gr.name = source.attachment_name;
		gr.payload = source.attachment_payload;
		gr.source = table + ":" + target.sys_id;
		queueID = gr.insert();
				
		var getAttachStatus = new GlideRecord('ecc_queue');
		getAttachStatus.addQuery('sys_id', queueID);
		getAttachStatus.query();		
		if (getAttachStatus.next())
					attachment_status = getAttachStatus.payload.toString();
					
	} */
})(source, map, log, target);