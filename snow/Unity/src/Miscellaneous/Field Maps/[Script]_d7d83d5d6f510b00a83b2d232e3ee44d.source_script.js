answer = (function transformEntry(source) {
 var ans = '';
	
	if(source.type == 'emergency'){
		ans ="emergency";
		
	}
	else if(source.type == 'expedited' || source.type == 'normal'){
		ans = 'normal';
	}
	else if(source.type == 'standard'){
		ans = 'standard';
	}
	return ans; // return the value to be put into the target field

})(source);