if (gs.nil(source.backout_plan)) {
    answer = '';
} else {
    answer = source.backout_plan.replace(/(?:\r\n|\r|\n)/g, '\n');
}