answer = (function transformEntry(source) {

	
	if(source.sys_created_by == "partner_gateway" || source.sys_created_by == "gkumar595")
		{
			if(action == "insert")
				{
					//Check the urgency to Severity mapping
					var urg = new GlideRecord("u_partner_urgency_to_severity_mapping");
					urg.addQuery("u_partner_urgency",source.partner_urgency);
					urg.addQuery("u_service_offering",source.business_service);
					urg.query();
					if(urg.next())
						{
							return urg.u_incident_severity;
						}
					else
						{
							return "4";
						}
				}
			else
				{
					return "";
				}
		}
	else
		{
			return source.severity;
		}
	

})(source);