//answer = ;source.description.replace(/(?:\r\n|\r|\n)/g, '\n');
var sdes = source.description.toString();
	var sdes_rep = sdes.replace(/\r/g, "\n");

	
	answer = sdes_rep;