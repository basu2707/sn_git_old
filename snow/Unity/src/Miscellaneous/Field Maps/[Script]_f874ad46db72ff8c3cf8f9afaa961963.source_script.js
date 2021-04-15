answer = (function transformEntry(source) {

	var sdes = source.description.toString();
	var sdes_rep = sdes.replace(/\r/g, "\n");
	return sdes_rep;

})(source);