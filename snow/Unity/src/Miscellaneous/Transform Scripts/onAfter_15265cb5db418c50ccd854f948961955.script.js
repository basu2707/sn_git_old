(function runTransformScript(source, map, log, target /*undefined onStart*/ ) {
    //STRY0024004
    //This script writes a work note for INC, in case there's no match found for TTS Solution Code / Cause Code in ITSM codes table 
    var amaAPI = gs.getProperty('IOP_AMASNOW_ServiceAccountUserName').toString().split(",");
    var ttsAPI = gs.getProperty('IOP_TTSSNOW_ServiceAccountUserName').toString().split(",");
    var flag = false;

    if (new ArrayUtil().contains(amaAPI, source.sys_created_by) || new ArrayUtil(ttsAPI, source.sys_created_by)) {
        flag = true;
    }

    if (flag == true) {
        var itsmMatchFound = 1;
        if (source.cause_code != '' || source.solution_code != '') {
            var inc = new GlideRecord('incident');
            inc.addQuery('sys_id', target.sys_id);
            inc.query();
            if (inc.next()) {
                if (source.cause_code != '') {
                    var causeFind = new GlideRecord('u_itsm_codes');
                    causeFind.addEncodedQuery('u_name=' + source.cause_code + '^ORu_external_id=' + source.cause_code + '^u_active=true^u_type=2');
                    causeFind.query();
                    if (!causeFind.next()) {
                        itsmMatchFound = 0;
                        inc.work_notes = "TTS Cause Code not found and TTS auto-resolution cannot be completed until TTS to IOP Cause code is mapped. Insert failed for TTS cause codes " + source.cause_code;
                    }

                }

                if (source.solution_code != '') {
                    var Find = new GlideRecord('u_itsm_codes');
                    Find.addEncodedQuery('u_name=' + source.solution_code + '^ORu_external_id=' + source.solution_code + '^u_active=true^u_type=3');
                    Find.query();
                    if (!Find.next()) {
                        itsmMatchFound = 0;
                        inc.work_notes = "TTS Solution Code not found and TTS auto-resolution cannot be completed until TTS to IOP Solution Code is mapped. Insert failed for TTS solution code " + source.solution_code;
                    }

                }
                if (itsmMatchFound == 1 && inc.state != 5 || inc.state != 6) {
                    inc.state = 6; ////STRY0024004 - set incident state to resolved, if its not.
                }

                inc.update();
            }
        }
    }

})(source, map, log, target);