function populateBankGroupID(executionContext) {
    var formContext = executionContext.getFormContext();

    if (formContext.ui.getFormType() !== 1) {
        return;
    }

    var groupLookup = formContext.getAttribute("xrm_group");
    if (!groupLookup || !groupLookup.getValue()) {
        return;
    }

    var groupId = groupLookup.getValue()[0].id.replace(/[{}]/g, "");


    var bankGroupMapping = null;

    var req = new XMLHttpRequest();
    req.open("GET", Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v9.2/xrm_bankgroupmaps?$select=xrm_bankgroupid&$filter=_xrm_groupnumber_value eq " + groupId, false);
    req.setRequestHeader("OData-MaxVersion", "4.0");
    req.setRequestHeader("OData-Version", "4.0");
    req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    req.setRequestHeader("Accept", "application/json");
    req.setRequestHeader("Prefer", "odata.include-annotations=*");
    req.onreadystatechange = function () {
        if (this.readyState === 4) {
            req.onreadystatechange = null;
            if (this.status === 200) {
                var results = JSON.parse(this.response);
                console.log(results);
                for (var i = 0; i < results.value.length; i++) {
                    var result = results.value[i];
                    // Columns
                    var xrm_bankgroupmapid = result["xrm_bankgroupmapid"]; // Guid
                    bankGroupMapping = result["xrm_bankgroupid"]; // Text
                }
            } else {
                console.log(this.responseText);
            }
        }
    };
    req.send();

     if (bankGroupMapping) 
    {
        formContext.getAttribute("xrm_bankgroupid").setValue(bankGroupMapping);
    }
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function hideTabsForSpecificApp(executionContext) {
    var formContext = executionContext.getFormContext();
    var targetAppId = "0e99c2e8-a463-f011-bec3-6045bddf3ab5"; 

    Xrm.Utility.getGlobalContext().getCurrentAppProperties().then(function (app) {
        if (app && app.appId && app.appId.toLowerCase() === targetAppId.toLowerCase()) {
            var tabs = formContext.ui.tabs.get();
            for (var i = 0; i < tabs.length; i++) {
                var tab = tabs[i];
                if (tab.getName() === "tab_12") { // Claims tab 
                    continue;
                }
                tab.setVisible(false);
            }
        }
    }).catch(function (error) {
        console.error("Failed to get current app properties:", error);
    });
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Added by Meghansh - Special Service App

function openNewXmrDocument(primaryControl, selectedControl) {
    var formContext = primaryControl;

    var sourceTabName = "";
    formContext.ui.tabs.forEach(function (tab) {
        tab.sections.forEach(function (section) {
            section.controls.forEach(function (control) {
                if (control === selectedControl) {
                    sourceTabName = section.getName(); 
                }
            });
        });
    });




    var entityName = formContext.data.entity.getEntityName();
    var recordId = formContext.data.entity.getId();
    var recordName = formContext.data.entity.getPrimaryAttributeValue();
    var cleanId = recordId ? recordId.replace(/[{}]/g, "") : null;

    var formParameters = {
        sourceTab: sourceTabName
    };


    if (entityName === "xrm_claim") {
        formParameters["xrm_entityID"] = cleanId;
        formParameters["xrm_entityName"] = recordName;
        formParameters["xrm_entityType"] = "xrm_claim";
    } 

    var entityFormOptions = {
        entityName: "xrm_claimdocument",
        useQuickCreateForm: false
    };

    Xrm.Navigation.openForm(entityFormOptions, formParameters).then(
        function (result) {
            // Success 
        },
        function (error) {
            console.error("Error opening xrm_claimdocument form:", error.message);
        }
    );
}



function DocumentFormOnLoad(executionContext) {
    var formContext = executionContext.getFormContext();
    var queryParams = Xrm.Utility.getGlobalContext().getQueryStringParameters();


    if(formContext.getAttribute("xrm_name").getValue() == null)
        formContext.getAttribute("xrm_name").setValue("(No File Attached)");

    var entityType = queryParams["xrm_entityType"];

    var sourceTab = queryParams["sourceTab"];
    //var sourceTab = params.get("sourceTab") ? params.get("sourceTab").getValue() : null;

    if(entityType == "xrm_claim")
    {
        var claimId = queryParams["xrm_entityID"];
        var claimName = queryParams["xrm_entityName"];

        if (claimId && claimName) {
            var lookupValue = [{
                id: claimId.replace(/[{}]/g, ""),
                name: decodeURIComponent(claimName),
                entityType: "xrm_claim"
            }];
            var claimField = formContext.getAttribute("xrm_claim");
            if (claimField) {
                claimField.setValue(lookupValue);
            }
        }

         if (sourceTab) {
            var optionSetValue;

            switch (sourceTab) {
                case "tab_2_section_1":         //BOV
                    optionSetValue = 971870000;
                    break;
                case "tab_2_section_2":         //New Info
                    optionSetValue = 971870001;
                    break;
                
            }

            if (optionSetValue !== undefined && formContext.getAttribute("xrm_documenttype")) {
                formContext.getAttribute("xrm_documenttype").setValue(optionSetValue);
            }
        }
    }

    formContext.data.save();

}


function SetFileUploadedOn(executionContext) {
    var formContext = executionContext.getFormContext();

    var fileField = formContext.getAttribute("xrm_document");
    var uploadedOnField = formContext.getAttribute("xrm_documentuploadedon");

    var currentUserId = Xrm.Utility.getGlobalContext().userSettings.userId.replace(/[{}]/g, "");
    var currentUserName = Xrm.Utility.getGlobalContext().userSettings.userName;

            var lookupValue = [{
                id: currentUserId,
                name: currentUserName,
                entityType: "systemuser"
            }];

    if (fileField && fileField.getIsDirty()) 
    {
        if (fileField.getValue() && !uploadedOnField.getValue()) {
            uploadedOnField.setValue(new Date());
            formContext.getAttribute("xrm_documentuploaded").setValue(true);

        }
        if(fileField.getValue())
        {
            formContext.getAttribute("xrm_name").setValue(decodeURI(formContext.getAttribute("xrm_document").getValue().fileName));
            formContext.getAttribute("xrm_documentuploadedby").setValue(lookupValue);
        }

        formContext.data.save();

    }
    if(fileField.getValue() == null)
    {
        uploadedOnField.setValue(null);
        formContext.getAttribute("xrm_documentuploaded").setValue(false);
        formContext.getAttribute("xrm_name").setValue("(No Document attached)"); 
        formContext.getAttribute("xrm_documentuploadedby").setValue(null);

    }
   
}

// Lock the fields in the Claims VDR Access App
function lockFieldsForSpecificApp(executionContext) {
    var formContext = executionContext.getFormContext();
    var targetAppId = "0e99c2e8-a463-f011-bec3-6045bddf3ab5";

    // Get the current app properties
    Xrm.Utility.getGlobalContext().getCurrentAppProperties().then(function (app) {
        if (app && app.appId && app.appId.toLowerCase() === targetAppId.toLowerCase()) {

            // List of fields to lock
            var fieldsToLock = [
                "xrm_claimdate",
                "xrm_typeofclaim",
                "xrm_effectonrecoverability",
                "xrm_claimnotes",
                "xrm_bankgroupid",
                "ownerid",
                "xrm_documentsbybov",
                "xrm_claimvalue",
                "xrm_issue",
                "xrm_documentsfornewinformation"
            ];

            // Loop through each field and lock it
            fieldsToLock.forEach(function (fieldName) {
                var control = formContext.getControl(fieldName);
                if (control) {
                    control.setDisabled(true);
                } else {
                    console.warn("Field not found on form:", fieldName);
                }
            });
        }
    }).catch(function (error) {
        console.error("Failed to get current app properties:", error);
    });
}
