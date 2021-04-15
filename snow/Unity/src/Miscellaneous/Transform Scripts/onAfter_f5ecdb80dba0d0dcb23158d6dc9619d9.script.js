(function runTransformScript(source, map, log, target /*undefined onStart*/ ) {

    // Add your code here
    var group = "",
        owner = "",
        isMember;

    group = checkIfGroupExists();
    owner = checkIfUserExists();
    isMember = checkIfUserIsMember();


    if (group != "" && owner != "" && isMember == "true") {

        target.u_owner_group = group;
        target.u_owned_by = owner;

    } else if ((group != "" && owner != "" && isMember == "false") || (group != "" && owner == "" && isMember == "false")) {


        target.u_owner_group = group;
		target.u_owned_by = "";
        target.work_notes = source.u_incident_manager + ' is not a member of ' + source.u_incident_manager_group + ' and therefore the incident manager was left blank.';


    }

    target.update();


    function checkIfGroupExists() {

        if (source.u_incident_manager_group != '') {

            var gr = new GlideRecord("sys_user_group");
            gr.addQuery("name", source.u_incident_manager_group);
            gr.query();
            if (gr.next()) {

                return gr.sys_id;
            }
        }
        return "";





    }

    function checkIfUserExists(user) {

        if (source.u_incident_manager != '') {


            var gr = new GlideRecord("sys_user");
           var or =  gr.addQuery("user_name", source.u_incident_manager);
			or.addOrCondition("sys_id",source.u_incident_manager);
            gr.query();
            if (gr.next()) {

                return gr.sys_id;
            }
        }
        return "";




    }

    function checkIfUserIsMember() {

        if (source.u_incident_manager_group != '' && source.u_incident_manager != '') {


            var gr = new GlideRecord("sys_user_grmember");
            gr.addQuery("group.name", source.u_incident_manager_group);
            gr.addQuery("user.user_name", source.u_incident_manager);
            gr.query();
            if (gr.next()) {

                return "true";
            }
        }
        return "false";


    }

})(source, map, log, target);