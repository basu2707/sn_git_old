var attrs = new Packages.java.util.HashMap();
	var ca = new GlideColumnAttributes('external_ticket_unique_id');
	ca.setType('string');
	ca.setUsePrefix(false);
	attrs.put('external_ticket_unique_id', ca);
	
	var tc = new GlideTableCreator('x_mcim_unified_change', 'Change');
	tc.setColumnAttributes(attrs);
	tc.update(); 