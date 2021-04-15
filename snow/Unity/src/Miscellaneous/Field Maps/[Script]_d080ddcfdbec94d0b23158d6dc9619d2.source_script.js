answer = (function transformEntry(source) {

    //Here we have to verify that subcategory which is provided is related to correct category or not
    var verifySubcategory = new GlideRecord("sys_choice");
    verifySubcategory.addEncodedQuery("name=change_request^element=u_subcategory^inactive=false^dependent_value=" + source.category + "^value=" + source.subcategory);
    verifySubcategory.query();
    if (verifySubcategory.next()) {
        return verifySubcategory.value;
    } else {
        return ""; // return the value to be put into the target field
    }

})(source);