answer = (function transformEntry(source) {

	// Add your code here
	var des = source.description.toString();
	var des_rep = des.replace(/(?:\r\n|\r|\n)/g, '\n');

	return des_rep; // return the value to be put into the target field

})(source);