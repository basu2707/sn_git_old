if (gs.nil(source.comments)) {
    // if the comments from the source record are null, return an empty string
    answer = '';
} else {
    // if the comments from the source record are not null, return a transformed string
    answer = source.comments.replace(/(?:\r\n|\r|\n)/g, '\n');
}
