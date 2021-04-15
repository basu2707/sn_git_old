var UnityUtil4Catalog = Class.create();
UnityUtil4Catalog.prototype = Object.extendsObject(UnityUtil, {
    initialize: function () {},

    unity_get_ritm: function (queryParam,method, limitParam, offsetParam, relatedList) {
        var ordered = {};
        var limit = (parseInt(limitParam) > 0) ? limitParm : 1000;
        var table_name = "sc_req_item";
        var ritmGr = new GlideRecord(table_name);
        if (queryParam)
            ritmGr.addEncodedQuery(queryParam);
        ritmGr.setLimit(limit);
        if (parseInt(offsetParam))
            ritmGr.chooseWindow(parseInt(offsetParam), parseInt(offsetParam) + limit);
        ritmGr.query();
        var collect = [];
        while (ritmGr.next()) {
            var obj = {};
            
            for (var field in ritmGr) {
                //SKIP VARIABLE PPOL, IT WILL BE HANDLED SEPERATELY
                //if(ritmGr[field].getED().getInternalType() == 'variables')
                // continue;
                // For general fields
                if (ritmGr[field] && ritmGr[field].getED().getInternalType() != 'reference') {
                    obj[field] = ritmGr[field].getDisplayValue();
                }
                // For reference fields
                else if (ritmGr[field] && ritmGr[field].getED().getInternalType() == 'reference') {
                    obj[field] = {};
                    obj[field].display_value = ritmGr[field].getDisplayValue();
                    obj[field].value = ritmGr.getValue(field);
                    obj[field].table = ritmGr[field].getReferenceTable();
                }
                // For Glide List fiels
                else if (ritmGr[field] && ritmGr[field].getED().getInternalType() != 'watch_list') {
                    obj[field] = ritmGr[field].getDisplayValue();
                }
                // For time and date fields
                else if (ritmGr[field] && ritmGr[field].getED().getInternalType() != 'glide_date_time') {
                    obj[field] = ritmGr.getValue(field);
                }
                // Logic for Journal fiels
                if (method != 'post' && (field == 'work_notes' || field == 'comments')) {
                    obj[field] = this.getJournalArray(table_name, ritmGr.getUniqueValue(), field);
                }
            }
            obj.variables = this._getVariablesObj(ritmGr);
            // ----------------Related Lists--------------------------------------//
            if(relatedList == true){
                obj.tasks=this._getCatalogTasks(ritmGr); 
            }
            //----------------------------------------------------------------------//
            //if(get_attachments_meta)
            ordered = this._sortObjByKey(obj);
            collect.push(ordered);
        }
        return collect;

    },

    _getCatalogTasks: function(ritmGr){
        var taskGr = new GlideRecord('sc_task');
        taskGr.addQuery('request_item',ritmGr.getUniqueValue());
        taskGr.query();
        var taskArray = [];
        while(taskGr.next()){
            var obj = {};
            for (var field in taskGr) {
                //SKIP VARIABLE PPOL, IT WILL BE HANDLED SEPERATELY
                //if(taskGr[field].getED().getInternalType() == 'variables')
                // continue;
                // For general fields
                if (taskGr[field] && taskGr[field].getED().getInternalType() != 'reference') {
                    obj[field] = taskGr[field].getDisplayValue();
                }
                // For reference fields
                else if (taskGr[field] && taskGr[field].getED().getInternalType() == 'reference') {
                    obj[field] = {};
                    obj[field].display_value = taskGr[field].getDisplayValue();
                    obj[field].value = taskGr.getValue(field);
                    obj[field].table = taskGr[field].getReferenceTable();
                }
                // For Glide List fiels
                else if (taskGr[field] && taskGr[field].getED().getInternalType() != 'watch_list') {
                    obj[field] = taskGr[field].getDisplayValue();
                }
                // For time and date fields
                else if (taskGr[field] && taskGr[field].getED().getInternalType() != 'glide_date_time') {
                    obj[field] = taskGr.getValue(field);
                }
                // Logic for Journal fiels
                if (field == 'work_notes' || field == 'comments') {
                    obj[field] = this.getJournalArray(taskGr.getTableName(), taskGr.getUniqueValue(), field);
                }
            }
            var taskordered = this._sortObjByKey(obj);
            taskArray.push(taskordered);
        }
        return taskArray;
    },
    _getVariablesObj: function (gr) {
        var ownvar = new GlideRecord('sc_item_option_mtom');
        ownvar.addQuery('request_item', gr.getUniqueValue());
        ownvar.addNotNullQuery('sc_item_option.value');
        //ownvar.addQuery('sc_item_option.value', '!=','');
        //List of variables to ignore
        ownvar.addQuery('sc_item_option.item_option_new.type', '!=','17'); //	Macro with Label
        ownvar.addQuery('sc_item_option.item_option_new.type', '!=','14'); //Macro
        ownvar.addQuery('sc_item_option.item_option_new.type', '!=','11');//Label
        ownvar.addQuery('sc_item_option.item_option_new.type', '!=','19');//Container Start
        ownvar.addQuery('sc_item_option.item_option_new.type', '!=','24');//Container Split
        ownvar.addQuery('sc_item_option.item_option_new.type', '!=','20');//Container End
        ownvar.addQuery('sc_item_option.item_option_new.type', '!=','12');//Break
        ownvar.orderBy('sc_item_option.order');
        ownvar.query();
        var collect = [];
        gs.info(ownvar.getRowCount());
        while(ownvar.next()){
            var field = ownvar.sc_item_option.item_option_new;
            var fieldValue = ownvar.sc_item_option.item_option_new.name;
            gs.info(fieldValue);
            if(fieldValue && fieldValue != undefined){
                var obj = {};
                obj.label = field.getDisplayValue();
                obj.name = fieldValue+'';
                obj.value = gr.variables[fieldValue].getDisplayValue();
                collect.push(obj);
            } 
        }
        return collect;
    },

    _sortObjByKey: function(obj){
        var ordered = {};
        Object.keys(obj).sort().forEach(function (key) {
            ordered[key] = obj[key];
        });
        return ordered;
    },

    type: 'UnityUtil4Catalog'
});