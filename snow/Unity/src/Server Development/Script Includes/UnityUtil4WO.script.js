var UnityUtil4WO = Class.create();
UnityUtil4WO.prototype = {
    initialize: function() {},

    validateWO: function(workOrder) {
        var status = {};
        // get initiated from value from associated mapping in payload
        var associatedRec = this.getAssociatedRecord(workOrder.association);
        gs.info('associatedRec is ' + associatedRec.number);
        status.association = associatedRec.number;
        // check to fetch WO number from Originatin system table for maching JB# and JBT#
        var existingWOT = this.getWOTfromOriginatingSystem(workOrder.job);
        if (existingWOT != '') {
            // Fetch WOT for returned WO# and associated number(INC or CHG)
            // var wotNumber = this.getWOT(woForExistingWOT, associatedRec);
            status.wot = this.updateWorkOrderTask(workOrder, workOrder.wot, existingWOT.number);
        } else {
            // Check if WO# existing for JB#
            var woForExistingJB = this.getWOforExistingJB(workOrder.job);
            if (woForExistingJB != '') {
                status.wot = this.createWorkOrderTask(workOrder, workOrder.wot, woForExistingJB, associatedRec);
            }
            // Create New WO and WOT
            else {
                gs.info(' no esitinf WO. Need to create new WO and WOT');
                status.wo = this.createWorkOrder(workOrder, associatedRec);
            }
        }
        return status;
    },

    getWOTfromOriginatingSystem: function(job) {
        var WOT = '';
        var orgSourceQuery = 'u_source_job_id=' + job.jb_id + '^u_source_job_sub_id=' + job.jb_task;
        var orgSource = new GlideRecord('u_originating_system_details');
        orgSource.addEncodedQuery(orgSourceQuery);
        orgSource.query();
        if (orgSource.next()) {
            gs.info(' org source ' + orgSource.u_parent.number);
            WOT = orgSource.u_parent;
        }
        return WOT;

    },

    getWOforExistingJB: function(job) {
        var WO = '';
        //var orgSourceQuery = 'u_source_job_id=' + job.jb_id;
        var orgSourceQuery = 'u_source_job_id=' + job.jb_id + '^u_source_job_sub_id=NULL';
        var orgSource = new GlideRecord('u_originating_system_details');
        orgSource.addEncodedQuery(orgSourceQuery);
        orgSource.query();
        if (orgSource.next()) {
            gs.info(' org source ' + orgSource.u_parent.number);
            WO = orgSource.u_parent;
        }
        return WO;
    },

    getAssociatedRecord: function(association) {
        var parent = new GlideRecord(association.table);
        parent.get('number', association.number);
        return parent;
    },

    getWOT: function(wo, associatedRec) {
        var wot = new GlideRecord('wm_task');
        wot.addQuery('parent', wo);
        wot.addQuery('initiated_from', associatedRec.sys_id);
        wot.query();
        if (wot.next()) {
            return wot.number;
        }
    },

    getWO: function(wot) {
        var woTask = new GlideRecord('wm_task');
        woTask.get(wot.sys_id);
        return woTask.parent.number;
    },

    updateWorkOrderTask: function(wo, wot, wotNumber) {
        var wotStatus = {};
        var number = wotNumber;
        gs.info(' wotNumber in updateWorkOrderTask is ' + number);
        //gs.info('in create workorder Task loop - work order task is '+wot.number);
        var workOrderTask = new GlideRecord('wm_task');
        workOrderTask.get('number', number);
        workOrderTask.dispatch_group = '96fb652637232000158bbfc8bcbe5db4';
        workOrderTask.cmdb_ci = workOrderTask.initiated_from.cmdb_ci;
        workOrderTask.opened_by = this.getUser(wot.opened_by);
        workOrderTask.assignment_group = this.getGroup(wot.assignment_group);
        workOrderTask.assigned_to = wot.assigned_to;
        workOrderTask.additional_assignee_list += this.getMultipleUsers(wot.additional_assignee_list);
        workOrderTask.acknowledged_on = wot.acknowledged_on;
        workOrderTask.actual_travel_start = wot.actual_travel_start;
        workOrderTask.work_start = wot.work_start;
        workOrderTask.work_end = wot.work_end;
        workOrderTask.work_notes = wot.work_notes;
        workOrderTask.short_description = wot.description;
        workOrderTask.description = wot.description;
        var timeVal = this.getDuration(wot.estimated_work_duration);
        workOrderTask.estimated_work_duration.setDateNumericValue(timeVal);
        workOrderTask.dispatched_on = wot.dispatched_on;
        if (workOrderTask.update()) {
            gs.info(' workorder Task update function ' + wot.number);
            wotStatus.wo_number = workOrderTask.parent.number;
            wotStatus.number = workOrderTask.number;
            wotStatus.status = 'Update success';
        } else {
            gs.info(' workorder Task exception');
            wotStatus.wo_number = workOrderTask.parent.number;
            wotStatus.number = workOrderTask.number;
            wotStatus.status = 'Update fail';
        }
        return wotStatus;
    },

    createWorkOrderTask: function(wo, wot, woNumber, associatedRec) {
        var wotStatus = {};
        //gs.info(' wot.estimated_work_duration is ' + wot.estimated_work_duration + ' wo sys id is '+wo.sys_id);
        gs.info('in create workorder Task loop - work order task is ' + woNumber);
        var workOrderTask = new GlideRecord('wm_task');
        workOrderTask.initialize();
        workOrderTask.parent = woNumber;
        //workOrderTask.dispatch_group = '96fb652637232000158bbfc8bcbe5db4';
        // workOrderTask.cmdb_ci = wot.cmdb_ci;
        workOrderTask.opened_by = this.getUser(wot.opened_by);
        workOrderTask.assignment_group = this.getGroup(wot.assignment_group);
        workOrderTask.assigned_to = wot.assigned_to;
        workOrderTask.additional_assignee_list += this.getMultipleUsers(wot.additional_assignee_list);
        workOrderTask.acknowledged_on = wot.acknowledged_on;
        workOrderTask.actual_travel_start = wot.actual_travel_start;
        workOrderTask.work_start = wot.work_start;
        workOrderTask.work_end = wot.work_end;
        workOrderTask.work_notes = wot.work_notes;
        workOrderTask.short_description = wot.description;
        workOrderTask.description = wot.description;
        workOrderTask.dispatched_on = wot.dispatched_on;
        if (workOrderTask.insert()) {
            workOrderTask.initiated_from = associatedRec.sys_id;
            workOrderTask.cmdb_ci = associatedRec.cmdb_ci;
            var timeVal = this.getDuration(wot.estimated_work_duration);
            workOrderTask.estimated_work_duration.setDateNumericValue(timeVal);
            workOrderTask.update();
            var orgSystem = new GlideRecord('u_originating_system_details');
            orgSystem.initialize();
            orgSystem.u_parent = workOrderTask.sys_id;
            // orgSystem.u_source_job_name = wo.job.job_name;
            orgSystem.u_source_job_id = wo.job.jb_id;
            orgSystem.u_source_job_link = wo.job.jb_link;
            orgSystem.u_source_job_sub_id = wo.job.jb_task;
            orgSystem.u_source_system = wo.source;
            orgSystem.insert();
            gs.info(' workorder Task create function ' + workOrderTask.number+ ' orgSystem record is ' + orgSystem.sys_id + ' associatedRec.sys_id is ' + associatedRec.sys_id);
            wotStatus.wo_number = workOrderTask.parent.number;
            wotStatus.number = workOrderTask.number;
            wotStatus.status = 'Create success';
        } else {
            gs.info(' workorder Task create exception');
            wotStatus.wo_number = workOrderTask.parent.number;
            wotStatus.number = workOrderTask.number;
            wotStatus.status = 'Create fail';
        }
        return wotStatus;
    },

    createWorkOrder: function(wo, associatedRec) {
        var woStatus = {};
        var workOrder = new GlideRecord('wm_order');
        workOrder.initialize();
        workOrder.short_description = wo.wot.description;
        workOrder.insert();
        gs.info(' WO from createWorkOrder is ' + workOrder.number);
        var orgSystem = new GlideRecord('u_originating_system_details');
        orgSystem.initialize();
        orgSystem.u_parent = workOrder.sys_id;
        // orgSystem.u_source_job_name = wo.job.job_name;
        orgSystem.u_source_job_id = wo.job.jb_id;
        orgSystem.u_source_job_link = wo.job.jb_link;
        //orgSystem.u_source_job_sub_id = wo.job.jb_task;
        orgSystem.u_source_system = wo.source;
        orgSystem.insert();
        var wm_task = wo.wot;
        woStatus.wot = this.createWorkOrderTask(wo, wo.wot, workOrder.sys_id, associatedRec);
        return woStatus;
    },


    getUser: function(user) {
        var userSysID = '';
        var query = 'sys_id=' + user + '^ORuser_name=' + user; // Search by sys_id, name and user ID
        if (user) {
            var usr = new GlideRecord('sys_user');
            usr.addEncodedQuery(query);
            usr.query();
            if (usr.next()) {
                userSysID = usr.sys_id;
            }
        }
        return userSysID;
    },


    getGroup: function(group) {
        var groupSysID = '';
        var query = 'sys_id=' + group + '^ORname=' + group; // Search Assignment group with sys_id or name of the group
        if (group) {
            var grp = new GlideRecord('sys_user_group');
            grp.addEncodedQuery(query);
            grp.query();
            if (grp.next()) {
                groupSysID = grp.sys_id;
            }
        }
        return groupSysID;
    },

    getMultipleUsers: function(users) {
        var userSysID = '';
        var user = users.split(',');
        for (x in user) {
            if (user[x]) {
                var query = 'sys_id=' + user[x] + '^ORuser_name=' + user[x]; // Search by sys_id, name and user ID
                var usr = new GlideRecord('sys_user');
                usr.addEncodedQuery(query);
                usr.query();
                if (usr.next()) {
                    userSysID += ',' + usr.sys_id;
                }
            }
        }
        return userSysID;
    },

    getDuration: function(duration) {
        var day = duration.split(' ');
        //gs.print(' dur '+day[0]);
        var dayVal, time = '';
        if (day.length == 1) {
            dayVal = '0';
            time = day[0].split(':');
        } else {
            dayVal = parseInt(day[0]);
            time = day[1].split(':');
        }
        var hr = parseInt(time[0]);
        var min = parseInt(time[1]);
        var sec = parseInt(time[2]);
        //gs.info('' + day[0] + ':' + time[0] + ':' + time[1] + ':' + time[2]);
        var timeVal = (((((dayVal * 24) + hr) * 60) + min) * 60) + sec;
        timeVal = timeVal * 1000;
        gs.info(' timeVal ' + timeVal);
        return timeVal;
    },

    type: 'UnityUtil4WO'
};