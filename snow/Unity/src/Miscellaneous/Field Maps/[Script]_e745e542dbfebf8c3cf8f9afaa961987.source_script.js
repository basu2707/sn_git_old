answer = (function transformEntry(source) {

	var comments = source.comments;
	comments = comments.replace(/(?:\r\n|\r|\n)/g, '\n');
	return comments; // return the value to be put into the target field

})(source);