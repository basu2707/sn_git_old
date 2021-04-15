(function process( /*RESTAPIRequest*/ request, /*RESTAPIResponse*/ response) {

	var workOrder;
    var data = {};

    var requestData = request.body.data.data;
    if (requestData instanceof Array) {
        data.wo = [];
        for (x in requestData) {
            data.wo[x] = {};
            data.wo[x].result = [];
            workOrder = requestData[x].wo;
            if (workOrder instanceof Array) {
                for (y in workOrder) {
                    data.wo[x].result[y] = new UnityUtil4WO().validateWO(workOrder[y]);
                }
            } else {
                data.wo[x].result = new UnityUtil4WO().validateWO(workOrder);
            }
        }
    } else {
        data.wo = {};
        data.wo.result = [];
        workOrder = requestData.wo;
        if (workOrder instanceof Array) {
            for (y in workOrder) {
                data.wo.result[y] = new UnityUtil4WO().validateWO(workOrder[y]);
            }
        } else {
            data.wo.result = new UnityUtil4WO().validateWO(workOrder);
        }
    }

    var body = new global.JSON().encode(data);
    response.setBody({
        data: data
    });
    response.setStatus(200);

})(request, response);