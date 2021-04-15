answer = (function transformEntry(source) {

    var ans = '';
    if (action == 'insert') {
        var flag = false;
        var APIGroupID = gs.getProperty('IOP_ServiceAccount_GroupID');

        var serviceAccMembers = new GlideRecord("sys_user_grmember");
        serviceAccMembers.addEncodedQuery("group=" + APIGroupID + "^user.active=true");
        serviceAccMembers.query();
        while (serviceAccMembers.next()) {
            if (source.sys_created_by == serviceAccMembers.user.user_name.toString())
                flag = true;
        }
		
        if (flag == true || source.sys_created_by.toLowerCase() == "oiv_account" || source.sys_created_by.toLowerCase() == "partner_gateway") {
            ans = '-9';
        }
    }



    // Add your code here
    return ans; // return the value to be put into the target field

})(source);