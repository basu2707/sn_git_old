(function runTransformScript(source, map, log, target /*undefined onStart*/ ) {

var ACCnumber = source.	u_account_number;
	var ACCName = source.u_account;
	
	if(ACCnumber == '' && ACCName == ''){
		error = true;
	
       error_message = "Account Number and Account Name are Mandatory fields to create Case";
	}
})(source, map, log, target);