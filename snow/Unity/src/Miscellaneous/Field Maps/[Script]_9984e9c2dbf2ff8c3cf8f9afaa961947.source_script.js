answer = (function transformEntry(source) {

	var work_notes = source.work_notes;
	work_notes = work_notes.replace(/(?:\r\n|\r|\n)/g, '\n');
	return work_notes; // return the value to be put into the target field

})(source);