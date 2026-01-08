		var XLABS = {};

		if(typeof String.prototype.startsWith != 'function'){
		  String.prototype.startsWith = function (str){ 
			return this.indexOf(str) == 0; 
		  }; 
		}

		XLABS.getServerURL = function(url){
			
			var serverUrl = '';
			if(!url.startsWith("http")){
				serverUrl = ((typeof getClientUrl == 'function') ? getClientUrl() : 
					(window.parent && window.parent.Xrm && window.parent.Xrm.Page && 
					window.parent.Xrm.Page.context  && 
					typeof window.parent.Xrm.Page.context.getClientUrl == 'function')? 
					window.parent.Xrm.Page.context.getClientUrl() : Xrm.Page.context.getClientUrl() );

				if(url.charAt(0) === '/' && serverUrl.charAt(serverUrl.length -1) === '/' ){
					serverUrl = serverUrl.substring(0, serverUrl.length-1); 
				}
				else if(url.charAt(0) != '/' && serverUrl.charAt(serverUrl.length -1) != '/' ){
					serverUrl = serverUrl + '/'; 
				}
				serverUrl = serverUrl + url;
				return serverUrl;
			}
			return url;
		}


	XLABS.ajaxJSON = function (url, successCallback, failCallback, propertyBag){
		var serverUrl = XLABS.getServerURL(url);

		$.ajax({
			   type: "GET",
			   contentType: "application/json; charset=utf-8",
			   datatype: "json",
			   url: serverUrl,
			   beforeSend: function (XMLHttpRequest) { XMLHttpRequest.setRequestHeader("Accept", "application/json"); },
			   success: function (data, textStatus, XmlHttpRequest) 
			   { 
					   // Use only one of these two methods
		
					   // Use for a selection that may return multiple entities
					   var results = ((typeof data) === "string") ? JSON.parse(data): data;
					   
					   // Use for a single selected entity
					   successCallback(results.d, this, propertyBag);
				   
				},
				error: function (XmlHttpRequest, textStatus, errorThrown){
					if(failCallback){
//debugger;
						failCallback (XmlHttpRequest, textStatus, errorThrown, this, propertyBag);
					}
				}
		});
	}


		XLABS.createEntity = function (requestObj, aSync,propertyBag){

			var ODATA_EntityCollection = "/" + requestObj.entity;
			var ODATA_ENDPOINT = "XRMServices/2011/OrganizationData.svc";

			var CRMObject = {};

			for (var propName in requestObj) {
				if (requestObj.hasOwnProperty(propName)) {
					if (propName == "entity") {
						continue;
					}
					property = requestObj[propName];
					if (property && typeof property === 'object' && property.hasOwnProperty('Id')) {
						CRMObject[propName] = {
							__metadata: { type: "Microsoft.Crm.Sdk.Data.Services.EntityReference" },
							Id: property.Id,
							LogicalName: property.LogicalName
						};
					}
					else if (property && typeof property === 'object' && property.hasOwnProperty('Value')) {
						CRMObject[propName] = {
							__metadata: { type: "Microsoft.Crm.Sdk.Data.Services.OptionSetValue" },
							Value: property.Value
						};
					} else if (property && typeof property === 'string' && property.indexOf("$") === 0) {
						CRMObject[propName] = {
							__metadata: { type: "Microsoft.Crm.Sdk.Data.Services.Money" },
							Value: parseFloat(property.substring(1))
						};
					} else {
						CRMObject[propName] = property;
					}
				}
			}
			var jsonEntity = window.JSON.stringify(CRMObject);

			$.ajax({ type: "POST",
				contentType: "application/json; charset=utf-8",
				datatype: "json",
				async: !(!aSync),
				url: XLABS.getServerURL(ODATA_ENDPOINT + ODATA_EntityCollection),
				data: jsonEntity,
				beforeSend: function (XMLHttpRequest) {
					//Specifying this header ensures that the results will be returned as JSON.
					XMLHttpRequest.setRequestHeader("Accept", "application/json");
				},
				success: function (XmlHttpRequest, textStatus, errorThrown) {
					requestObj.success(XmlHttpRequest, textStatus, errorThrown,propertyBag);
				},
				error: function (XmlHttpRequest, textStatus, errorThrown, that) {
					requestObj.failed(XmlHttpRequest, textStatus, errorThrown,propertyBag);
				}
			});
		}

		if (typeof String.prototype.startsWith != 'function'){
			String.prototype.startsWith = function (str){
				return this.indexOf(str) == 0;
			};
		}


// Delete the entity record in CRM

XLABS.deleteEntity = function (id, type, successCallback, errorCallback,propertyBag) {
  
  $.ajax({
   type: "POST",
   contentType: "application/json; charset=utf-8",
   datatype: "json",
   url: XLABS.getServerURL("/XRMServices/2011/OrganizationData.svc/"+ type + "Set(guid'" + id + "')"),
   beforeSend: function (XMLHttpRequest) {
    //Specifying this header ensures that the results will be returned as JSON.                 
    XMLHttpRequest.setRequestHeader("Accept", "application/json");
    //Specify the HTTP method DELETE to perform a delete operation.                 
    XMLHttpRequest.setRequestHeader("X-HTTP-Method", "DELETE");
   },
   success: function (id, textStatus, xhr) {
   // Nothing is returned to the success function.
   console.log(id);
   console.log(xhr);
    successCallback(id,textStatus,xhr,propertyBag);
   },
   error: function (xhr, textStatus, errorThrown,propertyBag) {
    errorCallback();
   }
  });
}

//..................................................................................//
XLABS.updateEntity = function (requestObj, aSync,propertyBag) {
    var ODATA_EntityCollection = "/" + requestObj.entity + "(guid'" + requestObj.Id + "')";
    var ODATA_ENDPOINT = "XRMServices/2011/OrganizationData.svc";

    var CRMObject = {};

    for (var propName in requestObj) {
        if (requestObj.hasOwnProperty(propName)) {
            if (propName === "entity" || propName === "Id") {
                continue;
            }
            property = requestObj[propName];
            if (property && typeof property === 'object' && property.hasOwnProperty('Id')) {
                CRMObject[propName] = {
                    __metadata: { type: "Microsoft.Crm.Sdk.Data.Services.EntityReference" },
                    Id: property.Id,
                    LogicalName: property.LogicalName
                };
            }
            else if (property && typeof property === 'object' && property.hasOwnProperty('Value')) {
                CRMObject[propName] = {
                    __metadata: { type: "Microsoft.Crm.Sdk.Data.Services.OptionSetValue" },
                    Value: property.Value
                };
            } else if (property && typeof property === 'string' && property.indexOf("$") === 0) {
                CRMObject[propName] = {
                    __metadata: { type: "Microsoft.Crm.Sdk.Data.Services.Money" },
                    Value: parseFloat(property.substring(1))
                };
            } else {
                CRMObject[propName] = property;
            }
        }
    }
    var jsonEntity = window.JSON.stringify(CRMObject);

    $.ajax({ type: "POST",
        contentType: "application/json; charset=utf-8",
        datatype: "json",
        async: !(!aSync),
        url: XLABS.getServerURL(ODATA_ENDPOINT + ODATA_EntityCollection),
        data: jsonEntity,
        beforeSend: function (XMLHttpRequest) {
            //Specifying this header ensures that the results will be returned as JSON.
            XMLHttpRequest.setRequestHeader("Accept", "application/json");
            XMLHttpRequest.setRequestHeader("X-HTTP-Method", "MERGE");

        },
        success: function (XmlHttpRequest, textStatus, errorThrown) {
            requestObj.success(XmlHttpRequest, textStatus, errorThrown,propertyBag);
        },
        error: function (XmlHttpRequest, textStatus, errorThrown, that) {
            requestObj.failed(XmlHttpRequest, textStatus, errorThrown,propertyBag);
        }
    });
}