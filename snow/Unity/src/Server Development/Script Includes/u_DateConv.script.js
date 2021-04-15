var u_DateConv = Class.create();
u_DateConv.prototype = Object.extendsObject(global.AbstractAjaxProcessor, {
	u_DateConvFunc:function(date){
		var datefunc=date;
		var gdate=new GlideDateTime(datefunc);
		gdate.setValueUTC('datefunc', "dd-MM-yyyy HH:mm:ss"); 
		return datefunc;
	},

    type: 'u_DateConv'
});