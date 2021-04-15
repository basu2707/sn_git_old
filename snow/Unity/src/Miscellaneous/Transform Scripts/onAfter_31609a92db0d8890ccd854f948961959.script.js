//outage end times
(function runTransformScript(source, map, log, target /*undefined onStart*/ ) {

    //STRY0024014 - Map incoming ci outage data to INC table
    if (source.outages.nil())
        return;

    gs.info("sravani source outages" + source.outages);
    var allOutagesHaveEndTime = 1;
    var updatesMadeFromPartnerPayload = 0;
    var CIid;
    var check;
    var sourceoutages = source.outages.replace(/=/g, '":"').replace(/{cmdb/g, '{"cmdb').replace(/, end/g, '","end').replace(/, begin/g, '","begin').replace(/}/g, '"}');
    gs.log("sravani sourceoutages" + sourceoutages);
    gs.info("sravani sourceoutages" + sourceoutages);

    var parsedData = JSON.parse(sourceoutages);
    var length = parsedData.length;
    for (var i = 0; i < length; i++) {
        CIid = '';
        check = '';
        CIid = getCIsysid(parsedData[i].cmdb_ci.toString());
        if (CIid != '') {
            check = checkExistingOutages(CIid);
            if (check == '') {
                var gr = new GlideRecord('cmdb_ci_outage');
                gr.initialize();
                gr.task_number = target.sys_id;
                gr.cmdb_ci = CIid;
                if (parsedData[i].begin != undefined) {
                    var beginDate = new GlideDateTime(parsedData[i].begin);
                    beginDate.setValue(parsedData[i].begin);
                    gr.begin = beginDate;
                    if (parsedData[i].end != undefined) {
                        var endDate = new GlideDateTime(parsedData[i].end);
                        endDate.setValue(parsedData[i].end);
                        gr.end = endDate;
                    }
                }
                gr.insert();
            } else {
                var endDate1 = new GlideDateTime(parsedData[i].end);
                var gro = new GlideRecord('cmdb_ci_outage');
                gro.addQuery('sys_id', check);
                gro.addEncodedQuery('endISEMPTY');
                gro.query();
                if (gro.next()) {
                    //	Set incident to mitigated if it is not yet mitigated	
                    if (parsedData[i].end != undefined) {
                        if (isThisLastOutageWithNoEndTime == 'Yes')
                        //set INC state to mitigated before closing out last outage
                        {
                            var inc1 = new GlideRecord("incident");
                            inc1.addQuery("sys_id", target.sys_id);
                            inc1.query();
                            if (inc1.next()) {
                                if (inc1.state != 5 || inc1.state != 6) {
                                    inc1.state = 5;
                                    inc1.u_mitigated_new = gs.nowDateTme();
                                    inc1.u_mitigated = gs.nowDateTme();
                                    inc1.update();

                                }

                            }
                            //	Determine if all outages contain an end date. 
                            if (inc1.u_mitigated_new != '') {
                                if (checkAllOutages(inc1.u_mitigated_new) == 'Yes') {
                                    if (gro.start < endDate1) {
                                        gro.end = endDate1; //date1.toString();
                                        updatesMadeFromPartnerPayload = 1;
                                        gro.update();
                                    } else {
                                        inc.work_notes = "The provided endtime for Outage" + gro.cmdb_ci.name + " is less than Start time.";
                                    }
                                } else {
                                    // If they are valid, update them using the outage end time from the payload.
                                    if (endDate1 >= inc1.u_mitigated_new) {
                                        if (gro.start < endDate1) {
                                            gro.end = endDate1; //date1.toString();
                                            updatesMadeFromPartnerPayload = 1;
                                            gro.update();
                                        } else {
                                            inc.work_notes = "The provided endtime for Outage" + gro.cmdb_ci.name + " is less than Start time.";
                                        }
                                    } else {
                                        // If they are not valid, set the outage end time to be the incident mitigated time.
                                        gro.end = inc1.u_mitigated_new; //date1.toString();
                                        gro.update();
                                    }

                                }
                            }

                        } else {
                            if (endDate1 >= inc1.u_mitigated_new) {
                                gro.end = endDate1; //date1.toString();
                                updatesMadeFromPartnerPayload = 1;
                                gro.update();
                            } else {
                                inc.work_notes = "The provided endtime for Outage" + gro.cmdb_ci.name + " is less than Start time.";
                            }
                        }
                    }


                }
            }

        }

    }


    var grc = new GlideRecord('cmdb_ci_outage');
    grc.addQuery('task_number', target.sys_id);
    grc.addEncodedQuery('endISEMPTY');
    grc.query();
    if (grc.next()) {
        allOutagesHaveEndTime = 0;
    }

    var inc = new GlideRecord("incident");
    inc.addQuery("sys_id", target.sys_id);
    inc.query();
    if (inc.next()) {
        if (allOutagesHaveEndTime == 1) {
            if (updatesMadeFromPartnerPayload == 0)
                inc.work_notes = "AMA attempted to update end times for Outage CI but outages CIs already ended based on prior system or user updates.";
            if (source.close_code != '' && source.close_notes != '')
                inc.state = 6;
        } else {
            inc.work_notes = "AMA attempted to close the incident but not all Outage CIs have an end time";
        }

        inc.update();
    }

    // Supporting Function to Check if all outages contain an end date
    function isThisLastOutageWithNoEndTime() {
        var numberOfOutages = 0;
        var numberOfOutagesWithNoEndDate = 0;
        var grd = new GlideRecord('cmdb_ci_outage');
        grd.addQuery('task_number', target.sys_id);
        grd.addEncodedQuery('endISEMPTY');
        grd.query();
        while (grd.next()) {
            numberOfOutagesWithNoEndDate++;
            if (numberOfOutagesWithNoEndDate == 1)
                return 'Yes';
            else
                return 'No';
        }
    }


    // Supporting Function to Return SYS ID of Given outage CI
    function getCIsysid(ciName) {
        var gr = new GlideRecord('cmdb_ci');
        gr.addQuery('name', ciName);
        gr.query();

        if (gr.next())
            return gr.sys_id;
        else
            return '';
    }

    // Supporting Function to Check if outage is Already Populated
    function checkExistingOutages(sysID) {
        var gr = new GlideRecord('cmdb_ci_outage');
        gr.addQuery('task_number', target.sys_id);
        gr.addQuery('cmdb_ci', sysID);
        gr.query();
        if (gr.next()) {
            return gr.sys_id;
        } else
            return '';
    }

    function checkAllOutages(mitigatetime) {
        var gr = new GlideRecord('cmdb_ci_outage');
        gr.addQuery('task_number', target.sys_id);

        gr.addQuery('end', ">", mitigatetime);
        gr.query();
        if (gr.next()) {
            return 'Yes';
        } else
            return 'No';
    }


})(source, map, log, target);