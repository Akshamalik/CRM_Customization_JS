function validateContactInMarketingList(executionContext) {
    if (executionContext.getEventArgs().isDefaultPrevented()) {
        return;
    }
    var formContext = executionContext.getFormContext();
  
    var applicationType = formContext
      .getAttribute("fixer_applicationtype")
      .getValue();
    var contact = formContext.getAttribute("fixer_contact").getValue();
  
    // Validate required fields
    if (!applicationType || !contact) {
      Xrm.Utility.alertDialog(
        "Please provide both Application Type and Contact."
      );
      executionContext.getEventArgs().preventDefault(); // Prevent the save operation
      return;
    }
  
    var applicationTypeId = applicationType[0].id
      .replace("{", "")
      .replace("}", "");
    var contactId = contact[0].id.replace("{", "").replace("}", "");
  
    var execute_fixer_ValidateApplicants_Request = {
      ApplicationType: {
        "@odata.type": "Microsoft.Dynamics.CRM.fixer_applicationtype",
        fixer_applicationtypeid: applicationTypeId,
      },
      Contact: {
        "@odata.type": "Microsoft.Dynamics.CRM.contact",
        contactid: contactId,
      },
  
      getMetadata: function () {
        return {
          boundParameter: null,
          parameterTypes: {
            ApplicationType: {
              typeName: "mscrm.fixer_applicationtype",
              structuralProperty: 5,
            },
            Contact: { typeName: "mscrm.contact", structuralProperty: 5 },
          },
          operationType: 0,
          operationName: "fixer_ValidateApplicants",
        };
      },
    };
  
    // Prevent the save event until validation is complete
    executionContext.getEventArgs().preventDefault();
  
    Xrm.WebApi.execute(execute_fixer_ValidateApplicants_Request)
      .then(function (response) {
        if (response.ok) {
          formContext.data.entity.save();
          console.log("response set")
          return response.json();
        } else {
          throw new Error("Validation failed.");
        }
      })
      .catch(function (error) {
        // Handle error during validation
        console.log("Plugin Exception: " + error.message);
        Xrm.Utility.alertDialog("Error: " + error.message);
      });
  }
  