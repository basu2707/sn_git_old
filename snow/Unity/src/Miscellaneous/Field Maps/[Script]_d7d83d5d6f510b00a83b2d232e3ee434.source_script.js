if (gs.nil(source.close_notes)) {
//if (source.close_notes == '') {
    
// if the close_notes from the source record are null, return an empty string
    answer = '';
} else {
	
    // if the close_notes from the source record are not null, return a transformed string
    answer = source.close_notes.replace(/(?:\r\n|\r|\n)/g, '\n');
}

