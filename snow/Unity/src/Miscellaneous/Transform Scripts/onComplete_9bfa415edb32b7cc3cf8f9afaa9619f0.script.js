(function runTransformScript(source, map, log, target /*undefined onStart*/ ) {
	
	// The following list will control the fields that are returned in the response
	var catalogUnifiedUtil = new x_mcim_unified.UnityUtil4Catalog();
	var query4Util = "sys_id="+target.getUniqueValue();
	var responseObj = catalogUnifiedUtil.unity_get_ritm(query4Util, 'post');
	log.info("mateen: action: "+action);
	log.info("mateen: responseObj: "+JSON.stringify(responseObj[0]));
	responseObj = responseObj[0];
	if(action == 'update' ){
		//gs.info('reponse1'+JSON.stringify(response));
		for (var element in responseObj){
				response[element] = (typeof responseObj[element] == 'string') ? responseObj[element] : JSON.stringify(responseObj[element]);
		}
		log.info("mateen: response: "+JSON.stringify(response));
		if (attachment_status)
			response.attachment_status = attachment_status;
	}
	
})(source, map, log, target);