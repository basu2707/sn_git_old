answer = (function transformEntry(source) {

// Add your code here
	var sdes = source.short_description.toString();
	var sdes_rep = sdes.replace(/\r/g, "\n");

	
	return sdes_rep; // return the value to be put into the target field
	
})(source);