answer = (function transformEntry(source) {

	//here first we have to check whether the business service is empty or not

	var ci = source.business_service;

	if(ci == '')
	{
		return;
	}
	else
	{
		//check whether the string have one ci or multiple
		if(ci.indexOf(";")>-1)
		{
			//that means ci field have more than one service

			var array_of_cis = [];
			array_of_cis = ci.split(";");


			for(var g=0;g<array_of_cis.length;g++)
			{
				var findPSSysId = findActualPrimaryService(array_of_cis[g].trim());
				if(findPSSysId != '')
				{
					return findPSSysId;
				}
			}

		}
		else
		{
			var findSysId = findActualPrimaryService(ci);
			return findSysId;
		}
	}

	function findActualPrimaryService(service)
	{
		if(service == '')
			return '';
		
		var service_passed = service;
		var result = '';

		//First we will check whether the service passed is present in cmdb_ci_service table
		var query = 'sys_id=' + service_passed + '^ORname=' + service_passed; // Search for Business service with sys_id or name

		var FindCI = new GlideRecord('cmdb_ci_service');
		FindCI.addEncodedQuery(query);
		FindCI.query();
		if(FindCI.next())
		{
			result = FindCI.sys_id;
		}

		if(result != '')
		{
			return result;
		}
		else
		{
			var findCIAMA1 = new GlideRecord('cmdb_ci_service');
			findCIAMA1.addQuery("u_external_service_name",service_passed);
			findCIAMA1.query();
			if(findCIAMA1.getRowCount() == 1)
			{
				if(findCIAMA1.next())
				{
					result = findCIAMA1.sys_id;
				}
			}
			else if(findCIAMA1.getRowCount() > 1)
			{
				//That means we have multiple records with the External Service name

				var findUnique = new GlideRecord('cmdb_ci_service');
				findUnique.addQuery("u_external_service_name",service_passed);
				findUnique.addQuery("name",service_passed);
				findUnique.query();
				if(findUnique.getRowCount() == 1)
				{
					if(findUnique.next())
					{
						result = findUnique.sys_id;
					}
				}
				else if(findUnique.getRowCount() != 1)
				{
					//Here we have to find the parent and use that
					var ci_parent = new GlideRecord('cmdb_ci_service');
					ci_parent.addQuery("u_external_service_name",service_passed);
					ci_parent.query();
					while(ci_parent.next())
					{

						if(ci_parent.parent != '')
						{
							result = ci_parent.parent.sys_id;
							break;
						}
					}
				}
			}


		}
		return result;

	}

	/*
	var ci = source.business_service;
	var ans = '';
	var query = 'sys_id=' + ci + '^ORname=' + ci; // Search for Business service with sys_id or name
	if(ci)
		{
		var FindCI = new GlideRecord('cmdb_ci_service');
		FindCI.addEncodedQuery(query);
		FindCI.query();
		if (FindCI.next()) {
			ans = FindCI.sys_id;
		}
	}
	return ans; // return the value to be put into the target field
	*/

})(source);