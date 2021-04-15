(function runTransformScript(source, map, log, target /*undefined onStart*/ ) {
    var endtimeless = 0;

    var notallOutagesHaveEndTime = 0;
    var allOutagesHaveEndTime = 0;
    var updatesMadeFromPartnerPayload = 0;
    var CIid;
    var check;
    var lessendtimemessage = '';
    if (source.state == '6') {

        var device = new GlideRecord("cmdb_ci_endpoint");
        device.addQuery("sys_id", target.cmdb_ci);
        device.addQuery("type", "Fiber Node");
        device.query();
        if (device.next()) {

            if (target.state == 2 || target.state == -9 || target.state == 5) {

                resolveincident();


            } else if (target.state == 3 || target.state == 7 || target.state == 8) {


                target.work_notes = "TTS Update Failed: " + target.u_tts_ticket_id + " Attempted to mitigate and resolve the INC but failed because the INC was " + target.state.getDisplayValue();
                target.update();



            }
        }
    }

    function resolveincident() {
        if (source.outages.nil()) {


            if (target.u_mitigated_new == '') {

                target.state = 5;
                target.u_mitigated_new = source.sys_created_on;
                target.u_mitigated = new GlideDateTime().getDisplayValue();



            }

            var gro1 = new GlideRecord('cmdb_ci_outage');
            gro1.addQuery('task_number', target.sys_id);
            gro1.addEncodedQuery('end=NULL');
            gro1.query();
            while (gro1.next()) {

                gro1.end = source.sys_created_on;
                gro1.update();



            }

        } else {

            var sourceoutages = source.outages.replace(/=/g, '":"').replace(/{cmdb/g, '{"cmdb').replace(/, end/g, '","end').replace(/, begin/g, '","begin').replace(/}/g, '"}');
            var parsedData = JSON.parse(sourceoutages);
            var length = parsedData.length;
            for (var i = 0; i < length; i++) {

                CIid = '';
                check = '';
                // gs.info("unity parsed data" + parsedData[i].cmdb_ci.toString());
                CIid = getCIsysid(parsedData[i].cmdb_ci.toString());
                if (CIid != '') {

                    check = checkExistingOutages(CIid);
                    //gs.info("unity check" + check);

                    var endDate1 = new GlideDateTime(parsedData[i].end);
                    var gro = new GlideRecord('cmdb_ci_outage');
                    gro.addQuery('sys_id', check);
                    gro.addEncodedQuery('endISEMPTY');
                    gro.query();
                    if (gro.next()) {
                        if (endDate1 != undefined) {
                            if (gro.begin < endDate1) {


                                if (isThisLastOutageWithNoEndTime() == 'Yes') {

                                    if (target.u_mitigated_new == '') {

                                        target.state = 5;
                                        target.u_mitigated_new = updatemitigatetime();
                                        target.u_mitigated = new GlideDateTime().getDisplayValue();
                                        target.update();
                                        gro.end = endDate1;
                                        updatesMadeFromPartnerPayload = 1;

                                        gro.update();
                                    } else if (target.u_mitigated_new != '') {

                                        if (checkAllOutages(target.u_mitigated_new) == 'Yes') {

                                            gro.end = endDate1; //date1.toString();
                                            updatesMadeFromPartnerPayload = 1;
                                            gro.update();
                                        } else {
                                            if (endDate1 >= target.u_mitigated_new) {

                                                gro.end = endDate1; //date1.toString();
                                                updatesMadeFromPartnerPayload = 1;
                                                gro.update();
                                            } else {

                                                target.u_mitigated_new = updatemitigatetime();
                                                target.update();

                                                gro.end = endDate1; //date1.toString();
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
                                lessendtimemessage = "The Provided Endtime is less than Actual end time";

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
        if (!grc.next()) {

            allOutagesHaveEndTime = 1;
        } else {
            notallOutagesHaveEndTime = 1;
        }


        if (notallOutagesHaveEndTime == 1 || endtimeless == 1) {


            if (target.u_mitigated_new == '') {

                target.state = 5;
                target.u_mitigated_new = updatemitigatetime();
				target.u_mitigated = new GlideDateTime().getDisplayValue();
            }
            target.work_notes = "INC resolution failed as not all 'outage CIs' end times were specified and incident not updated to 'resolved' state and remains in mitigated ";


        } else if (allOutagesHaveEndTime == 1) {

            if (target.u_solution_code == '' && source.solution_code != '') {

                var Find = new GlideRecord('u_itsm_codes');

                Find.addEncodedQuery('u_name=' + source.solution_code + '^ORu_external_id=' + source.solution_code + '^u_active=true^u_type=3');
                Find.query();
                if (Find.next()) {
                    target.u_solution_code = Find.sys_id;
                } else {


                    target.u_solution_code = '6991672a1baf04107ff42f066e4bcbf2';
                }
            }


            if (target.u_cause_code == '' && source.cause_code != '') {

                var Find = new GlideRecord('u_itsm_codes');
                Find.addEncodedQuery('u_name=' + source.cause_code + '^ORu_external_id=' + source.cause_code + '^u_active=true^u_type=2');
                Find.query();
                if (Find.next()) {
                    target.u_cause_code = Find.sys_id;
                } else {


                    target.u_cause_code = '15616be61baf04107ff42f066e4bcbd9';


                }

            }
            if (target.close_code == '' && source.close_code != '') {

                target.close_code = source.close_code;
            }
            if (target.close_notes == '' && source.close_notes != '') {

                target.close_notes = source.close_notes.replace(/(?:\r\n|\r|\n)/g, '\n');
            }
            if (target.u_mitigated_new == '') {


                target.u_mitigated_new = updatemitigatetime();
            }
            target.state = 6;
        }

        target.update();


    }

    function getCIsysid(ciName) {
        var gr = new GlideRecord('cmdb_ci');
        gr.addQuery('name', ciName);
        gr.query();

        if (gr.next())
            return gr.sys_id;
        else
            return '';

    }

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

    function isThisLastOutageWithNoEndTime() {

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

            return 'Yes';
        } else
            return 'No';
    }

    function updatemitigatetime() {
        var getdate = new GlideRecord('cmdb_ci_outage'); // Get for latest end date
        getdate.addEncodedQuery("task_number=" + target.sys_id + "^endISNOTEMPTY");
        getdate.orderByDesc('end');
        getdate.query();
        if (getdate.next()) {


            return getdate.end;

        }
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