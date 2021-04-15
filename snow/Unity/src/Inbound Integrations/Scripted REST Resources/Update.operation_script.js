(function process( /*RESTAPIRequest*/ request, /*RESTAPIResponse*/ response) {

    // implement resource here
    var woNumber = request.pathParams.work_order;
    gs.info(' In wo update operation ');
    gs.info(' Work Order Number ' + woNumber);
    var WO = new GlideRecord('wm_order');
    WO.get('number', woNumber);
    gs.info(' work order record is ' + WO.sys_id);

    var workOrder;
    var data = {};
    var associatedRec,existingWOT = '';
    var requestData = request.body.data.data;
    data.wo = {};
    data.wo.result = [];
    workOrder = requestData.wo;
    if (workOrder instanceof Array) {
        for (y in workOrder) {
            associatedRec = new UnityUtil4WO().getAssociatedRecord(workOrder[y].association);
            existingWOT = new UnityUtil4WO().getWOTfromOriginatingSystem(workOrder[y].job);
            if (existingWOT != '') {
                data.wo.result[y] = new UnityUtil4WO().updateWorkOrderTask(workOrder[y], workOrder[y].wot, existingWOT.number);
            }
			else{
             data.wo.result[y] = new UnityUtil4WO().createWorkOrderTask(workOrder[y], workOrder[y].wot, WO.sys_id, associatedRec);
			}
        }
    } else {
        associatedRec = new UnityUtil4WO().getAssociatedRecord(workOrder.association);
		existingWOT = new UnityUtil4WO().getWOTfromOriginatingSystem(workOrder.job);
            if (existingWOT != '') {
                data.wo.result = new UnityUtil4WO().updateWorkOrderTask(workOrder, workOrder.wot, existingWOT.number);
            }
		else{
        data.wo.result = new UnityUtil4WO().createWorkOrderTask(workOrder, workOrder.wot, WO.sys_id, associatedRec);
		}
    }


    var body = new global.JSON().encode(data);
    response.setBody({
        data: data
    });
    response.setStatus(200);


})(request, response);