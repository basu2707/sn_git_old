(function process( /*RESTAPIRequest*/ request, /*RESTAPIResponse*/ response) {

    // implement resource here
    var woNumber = request.pathParams.work_order;
    var wotNumber = request.pathParams.wot_number;
    gs.info(' In wot create operation ');
    gs.info(' Work Order Number ' + woNumber + ' Work Order Task is ' + wotNumber);
    var WO = new GlideRecord('wm_order');
    WO.get('number', woNumber);
    gs.info(' work order record is ' + WO.sys_id);


    var workOrder;
    var data = {};
    var associatedRec, existingWOT = '';
    var requestData = request.body.data.data;
    data.wo = {};
    data.wo.result = [];
    workOrder = requestData.wo;
    data.wo.result = new UnityUtil4WO().updateWorkOrderTask(workOrder, workOrder.wot, wotNumber);

    var body = new global.JSON().encode(data);
    response.setBody({
        data: data
    });
    response.setStatus(200);
})(request, response);