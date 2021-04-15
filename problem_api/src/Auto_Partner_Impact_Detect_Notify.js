(function executeRule(current, previous /*null when async*/ ) {

    //Declaring variables
    var existingChildTickets;
    var potentialChildTickets;
    var newChildTicket;

    //Get the Impacted Partners Field into an Array
    var impactedPartnersArray = getAffectedAccounts();
  

    // Process Logic For Each Impacted Partner
    for (i = 0; i < impactedPartnersArray.length; i++) {
        // Check if Existing Child Ticket Exists
        existingChildTickets = displayChildPartnerTickets(impactedPartnersArray[i]);

        // If Child Ticket Does Not Exist, Search for Potential Child Tickets
        if (!existingChildTickets)
            potentialChildTickets = searchPotentialChildTickets(impactedPartnersArray[i]);

        //check if Auto Bonding Conditions are met
        var autoBond = new checkAutoBonding().autoBondingCondition(current, impactedPartnersArray[i]);
        // If Potential Child Tickets Do Not Exist, Create New Child Ticket
        if (!existingChildTickets && autoBond == true)
            newChildTicket = createNewPartnerTicket(impactedPartnersArray[i]);

        // If all other functions above do not result in an InfoMessage, Display the Catch All Message
        if (!existingChildTickets && !potentialChildTickets && !newChildTicket) {
            var partner = impactedPartnersArray[i];
            var outBoundLink = "problem_list.do?sysparm_query=u_external_systemsLIKE" + gs.getProperty("iop.partner.gateway") + "%5Eu_impacted_partnersLIKE" + partner + "%5EparentISNOTEMPTY";
            var outBoundLinkHref = " <a href='nav_to.do?uri=" + outBoundLink + "' target='_blank'>" + "OutBound" + "</a>";
            var inBoundLink = "problem_list.do?sysparm_query=u_external_systemsLIKE" + gs.getProperty("iop.partner.gateway") + "%5Eu_impacted_partnersLIKE" + partner + "%5EparentISEMPTY";
            var inBoundLinkHref = " <a href='nav_to.do?uri=" + inBoundLink + "' target='_blank'>" + "InBound" + "</a>";

            //gs.addInfoMessage("No problem are bonded with partner " + getPartnerName(impactedPartnersArray[i]) + " if you want to bond this problem please click on the Bond Problem button." + "To Link with an existing partner originated problem click   " + inBoundLinkHref + "; to link to an existing Comcast originated problem click outbound" + outBoundLinkHref);
			
			gs.addInfoMessage("No problem are bonded with partner " + getPartnerName(impactedPartnersArray[i]) + " if you want to bond this problem please click on the Bond Problem button." + "To Link with an existing Comcast originated problem click outbound" + outBoundLinkHref);

        }
        // Reset Logic Checks
        existingChildTickets = false;
        potentialChildTickets = false;
        newChildTicket = false;
    }


    // Return list of affected accounts from the Related list tab for the current Problem
    // This list will be partners only (PTGW)
    // Exclude Comcast as Affected Account
    function getAffectedAccounts() {
        var array = [];
        var comcastAccount = gs.getProperty("comcast.partner");
        var gr = new GlideRecord('u_m2m_tasks_accounts');
        gr.addQuery('u_task', current.sys_id);
        gr.addQuery('u_account.partner', true);
        gr.addQuery('u_account.sys_id', '!=', comcastAccount); // Dont Push Comcast as Partner
        gr.query();

        while (gr.next()) {
            array.push(gr.u_account.toString());
        }

        return array;
    }

	
    // This function will search for an existing child Problem for the given partner
    // The result will be an info message on the existing partner bonded problem related to the current problem
    // The input is the partner sys_id
    // The output is the info message
    // The function will return true if there is an existing child partner ticket, otherwise it will return false
    function displayChildPartnerTickets(partner) {
        var gr = new GlideRecord('problem');
        gr.addQuery('parent', current.sys_id);
        gr.addQuery('u_external_systems', gs.getProperty("iop.partner.gateway"));
        gr.addQuery('u_impacted_partners', partner);
        gr.query();

        if (gr.next()) {
            var partnerName = getPartnerName(partner);
            var childRecordLink = "<a href='nav_to.do?uri=" + gr.getLink() + "' target='_blank'>" + gr.number + "</a>";
            //var partnerName = getPartnerName(partner);
            var outBoundLink = "problem_list.do?sysparm_query=u_external_systemsLIKE" + gs.getProperty("iop.partner.gateway") + "%5Eu_impacted_partnersLIKE" + partner + "%5EparentISNOTEMPTY";

            var outBoundLinkHref = " <a href='nav_to.do?uri=" + outBoundLink + "' target='_blank'>" + "OutBound" + "</a>";
            var inBoundLink = "problem_list.do?sysparm_query=u_external_systemsLIKE" + gs.getProperty("iop.partner.gateway") + "%5Eu_impacted_partnersLIKE" + partner + "%5EparentISEMPTY";
            var inBoundLinkHref = " <a href='nav_to.do?uri=" + inBoundLink + "' target='_blank'>" + "InBound" + "</a>";
            //gs.addInfoMessage("Partner " + partnerName + " is affected. Child Problem " + childRecordLink + " is submitted to " + partnerName + " through the Partner Gateway. To look at existing partner originated problem click " + inBoundLinkHref + "; to look at existing Comcast originated problem click " + outBoundLinkHref + ".");
			gs.addInfoMessage("Partner " + partnerName + " is affected. Child Problem " + childRecordLink + " is submitted to " + partnerName + " through the Partner Gateway. To look at existing Comcast originated problem click " + outBoundLinkHref + ".");

            return true;
        }

        return false;
    }

    // This function will search for PTGW Bonded Problems (without a Parent) for the given partner
    // The result will be an info message on the list of potential PTGW Problems that can be bonded
    // The input is the partner sys_id
    // The output is the info message
    // The function will return true if there is an existing partner bonded tickets without a parent, otherwise it will return false

    function searchPotentialChildTickets(partner) {
        var gr = new GlideRecord('problem');
        gr.addQuery('u_external_systems', gs.getProperty("iop.partner.gateway"));
        gr.addQuery('u_impacted_partners', partner);
        gr.addQuery('state', '!=', 4);
        gr.addQuery('state', '!=', 5);
        gr.addQuery('state', '!=', 11);
        //gr.addNullQuery('parent_incident');
        gr.addNullQuery('parent');
        gr.query();

        var potentialRecordLinks = [];

        while (gr.next()) {
            potentialRecordLinks.push(" <a href='nav_to.do?uri=" + gr.getLink() + "' target='_blank'>" + gr.number + "</a>");
        }
        var autoBond = new checkAutoBonding().autoBondingCondition(current, partner);


        if (autoBond == true) {
            var partnerName = getPartnerName(partner);
            var outBoundLink = "problem_list.do?sysparm_query=u_external_systemsLIKE" + gs.getProperty("iop.partner.gateway") + "%5Eu_impacted_partnersLIKE" + partner + "%5EparentISNOTEMPTY";

            var outBoundLinkHref = " <a href='nav_to.do?uri=" + outBoundLink + "' target='_blank'>" + "OutBound" + "</a>";
            var inBoundLink = "problem_list.do?sysparm_query=u_external_systemsLIKE" + gs.getProperty("iop.partner.gateway") + "%5Eu_impacted_partnersLIKE" + partner + "%5EparentISEMPTY";
            var inBoundLinkHref = " <a href='nav_to.do?uri=" + inBoundLink + "' target='_blank'>" + "InBound" + "</a>";

            //gs.addInfoMessage("To Link with an existing partner originated problem click   " + inBoundLinkHref + "; to link to an existing Comcast originated problem click outbound" + outBoundLinkHref + ". If this problem is unrelated to any existing partner impacting problem please bond by clicking the Bond Problem button.");
			
			gs.addInfoMessage("To Link with an existing partner Comcast originated problem click " + outBoundLinkHref + ". If this problem is unrelated to any existing partner impacting problem please bond by clicking the Bond Problem button.");


            return true;
        }

        return false;
    }



    // This function will create a PTGW Bonded Problems for the given partner, and make it a Child of the current Problem
    // The result will be an info message on the newly created PTGW bonded Child Problem
    // The input is the partner sys_id
    // The output is the info message
    // The function will return true if ticket creation was successful
    function createNewPartnerTicket(partner) {
        var gk_is = new GlideRecord("task_cmdb_ci_service");
        gk_is.addQuery("task", current.sys_id);
        gk_is.query();
        while (gk_is.next()) {
            var gk_ps = new GlideRecord("u_m2m_configuratio_accounts");
            gk_ps.addQuery("u_account", partner);
            gk_ps.addQuery("u_configuration_item", gk_is.cmdb_ci_service);
            gk_ps.query();
            if (gk_ps.next()) {
                partnerservice = gk_ps.u_configuration_item;
                break;
            }
        }

        var partnerservice = '';
        var gr = new GlideRecord('problem');
        gr.addQuery("short_description", current.short_description);
        gr.addQuery("state", current.state);
        gr.addQuery("business_service", partnerservice);
        gr.addQuery("parent", current.sys_id);
        gr.query();
        if (!gr.next()) {

            gr.initialize();
            gr.short_description = current.short_description + " (" + getPartnerName(partner) + ")";
            gr.business_service = partnerservice;
            gr.cmdb_ci = current.cmdb_ci;
            gr.u_category = current.u_category;
            gr.u_subcategory = current.u_subcategory;
            gr.u_symptom = current.u_symptom;
            gr.state = current.state;
            gr.u_uimpact = current.u_uimpact;
            gr.urgency = current.urgency;
            gr.u_problem_type = current.u_problem_type;
            gr.u_problem_source = current.u_problem_source;
            gr.assignment_group = current.assignment_group;
            gr.assigned_to = current.assigned_to;
            gr.description = current.description;
            gr.parent = current.sys_id;
            gr.u_impacted_partners += partner;
            gr.u_external_systems += gs.getProperty("iop.partner.gateway"); // Partner Gateway
            gr.u_ptgw_owner = gs.getProperty("iop.comcast.customer.account"); // Comcast
			gr.u_ptgw_resolving_partner = gs.getProperty("iop.comcast.customer.account"); // Comcast

            gr.insert();
        }
        var partnerName = getPartnerName(partner);
        var outBoundLink = "problem_list.do?sysparm_query=u_external_systemsLIKE" + gs.getProperty("iop.partner.gateway") + "%5Eu_impacted_partnersLIKE" + partner + "%5EparentISNOTEMPTY";

        var outBoundLinkHref = " <a href='nav_to.do?uri=" + outBoundLink + "' target='_blank'>" + "OutBound" + "</a>";
        //var inBoundLink = "problem_list.do?sysparm_query=u_external_systemsLIKE" + gs.getProperty("iop.partner.gateway") + "%5Eu_ptgw_impacted_partnersLIKE" + partner + "%5EparentISEMPTY";
        //var inBoundLinkHref = " <a href='nav_to.do?uri=" + inBoundLink + "' target='_blank'>" + "InBound" + "</a>";


        if (gr.sys_id) {
            //var partnerName = getPartnerName(partner);
            var childRecordLink = "<a href='nav_to.do?uri=" + gr.getLink() + "' target='_blank'>" + gr.number + "</a>";

            //gs.addInfoMessage("Partner " + partnerName + " is affected. Child Problem " + childRecordLink + " has been created and submitted to " + partnerName + " through the Partner Gateway. To look at existing partner originated problem click " + inBoundLinkHref + "; to look at existing Comcast originated problem click " + outBoundLinkHref + ".");
			
			gs.addInfoMessage("Partner " + partnerName + " is affected. Child Problem " + childRecordLink + " has been created and submitted to " + partnerName + " through the Partner Gateway. To look at existing Comcast originated problem click " + outBoundLinkHref + ".");

            return true;
        }

        return false;
    }




    // This Supporting Function will Return the Display Name of the Partner
    function getPartnerName(partnerSysID) {
        var gr = new GlideRecord('customer_account');
        gr.get(partnerSysID);

        return gr.name;
    }

})(current, previous);