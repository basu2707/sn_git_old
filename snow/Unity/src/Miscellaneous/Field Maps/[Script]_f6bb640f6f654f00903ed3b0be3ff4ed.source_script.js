if (gs.nil(source.work_notes)) {
    // if the work notes from the source record are null, return an empty string
    answer = '';
} else {
    // if the work notes from the source record are not null, return a transformed string
    answer = source.work_notes.replace(/(?:\r\n|\r|\n)/g, '\n');
}


