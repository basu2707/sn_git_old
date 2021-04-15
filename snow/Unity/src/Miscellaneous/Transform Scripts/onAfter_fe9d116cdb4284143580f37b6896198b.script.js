(function runTransformScript(source, map, log, target /*undefined onStart*/ ) {
    if (source.outages.nil())
        return;
    var endtimeless = 0;
    var allOutagesHaveEndTime = 1;
    var updatesMadeFromPartnerPayload = 0;
    var CIid;
    var check;
    var device = new GlideRecord("cmdb_ci_endpoint");
    device.addQuery("sys_id", target.cmdb_ci);
    device.addQuery("type", "Fiber Node");
    device.query();
    if (!device.next()) {
        var sourceoutages = source.outages.replace(/=/g, '":"').replace(/{cmdb/g, '{"cmdb').replace(/, end/g, '","end').replace(/, begin/g, '","begin').replace(/}/g, '"}');

        ////gs.info("sravani sourceoutages" + sourceoutages);

        var parsedData = JSON.parse(sourceoutages);
        var length = parsedData.length;
        for (var i = 0; i < length; i++) {
            CIid = '';
            check = '';
            CIid = getCIsysid(parsedData[i].cmdb_ci.toString());
            if (CIid != '') {
                //gs.info("sravani CIid" + CIid);
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

                    }
                    check = gr.insert();
                }
                var inc1 = new GlideRecord("incident");
                inc1.addQuery("sys_id", target.sys_id);
                inc1.query();
                if (inc1.next()) {

                    var endDate1 = new GlideDateTime(parsedData[i].end);
                    //gs.info("sravani end" + endDate1);
                    //gs.info("sravani check" + check);
                    var gro = new GlideRecord('cmdb_ci_outage');
                    gro.addQuery('sys_id', check);
                    gro.addEncodedQuery('endISEMPTY');
                    gro.query();
                    if (gro.next()) {
                        //gs.info("sravani outage" + gro.sys_id);
                        if (endDate1 != undefined) {
                            if (gro.begin < endDate1) {

                                //gs.info("sravani endtime" + endDate1);
                                if (isThisLastOutageWithNoEndTime() == 'Yes') {
                                    //set INC state to mitigated before closing out last outage
                                    //gs.info("sravani lastoutage");


                                    //gs.info("sravani incident");
                                    if (inc1.u_mitigated_new == '') {
                                        //gs.info("sravani state");
                                        inc1.state = 5;
                                        inc1.u_mitigated_new = new GlideDateTime().getDisplayValue();
                                        inc1.u_mitigated = new GlideDateTime().getDisplayValue();

                                        gro.end = new GlideDateTime().getDisplayValue();
                                        updatesMadeFromPartnerPayload = 1;
                                        inc1.update();
                                        gro.update();

                                    } else if (inc1.u_mitigated_new != '') {
                                        //gs.info("sravani mitigated" + inc1.u_mitigated_new);
                                        if (checkAllOutages(inc1.u_mitigated_new) == 'Yes') {
                                            //gs.info("sravani one incident have more mitihated");
                                            gro.end = endDate1; //date1.toString();
                                            updatesMadeFromPartnerPayload = 1;
                                            gro.update();
                                        } else {
                                            if (endDate1 >= inc1.u_mitigated_new) {
                                                //gs.info("sravani more entime");
                                                gro.end = endDate1; //date1.toString();
                                                updatesMadeFromPartnerPayload = 1;
                                                gro.update();
                                            } else {
                                                //gs.info("sravaniupdate mitigate time" + new GlideDateTime(inc1.u_mitigated_new).getDisplayValue());
                                                gro.end = inc1.u_mitigated_new.getDisplayValue(); //date1.toString();
                                                updatesMadeFromPartnerPayload = 1;
                                                gro.update();
                                            }
                                        }
                                    }
                                } else {
                                    gro.end = endDate1; //date1.toString();
                                    updatesMadeFromPartnerPayload = 1;
                                    gro.update();
                                }

                            } else {

                                endtimeless = 1;
                                //gs.info("third sravani less end time");
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
            } else if (endtimeless == 1) {
                inc.work_notes = "The provided endtime for Outage is less than Start time";
            } else {
                inc.work_notes = "AMA attempted to close the incident but not all Outage CIs have an end time";
            }

            inc.update();
        }


    }

    function isThisLastOutageWithNoEndTime() {
        //gs.info("checking one outage");
        var numberOfOutages = 0;
        var numberOfOutagesWithNoEndDate = 0;
        var grd = new GlideRecord('cmdb_ci_outage');
        grd.addQuery('task_number', target.sys_id);
        grd.addEncodedQuery('endISEMPTY');
        grd.query();
        while (grd.next()) {
            numberOfOutagesWithNoEndDate++;
        }
        if (numberOfOutagesWithNoEndDate == 1) {
            //gs.info("Sravani one outage");
            return 'Yes';
        } else
            return 'No';
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