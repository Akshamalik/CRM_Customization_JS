var ContactValidationForm = (function () {
  var SaveMode = {
    Save: 1,
    SaveAndClose: 2,
    SaveAndNew: 59,
    Autosave: 70,
  };

  var isValidationNeeded = true;

  function validateContactInMarketingList(executionContext) {
    if (executionContext.getEventArgs().isDefaultPrevented()) {
      return;
    }

    var saveMode = executionContext.getEventArgs().getSaveMode();

    if (
      saveMode !== SaveMode.Save &&
      saveMode !== SaveMode.SaveAndClose &&
      saveMode !== SaveMode.SaveAndNew &&
      saveMode !== SaveMode.Autosave
    ) {
      return;
    }

    if (!isValidationNeeded) {
      isValidationNeeded = true;
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
      executionContext.getEventArgs().preventDefault();
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

    // Prevent save before async validation completes
    executionContext.getEventArgs().preventDefault();

    Xrm.WebApi.execute(execute_fixer_ValidateApplicants_Request)
      .then(function (response) {
        if (response.ok) {
          isValidationNeeded = false;
          console.log("response")
          // Trigger save based on mode
          if (saveMode === SaveMode.Save || saveMode === SaveMode.Autosave) {
            formContext.data.entity.save();
          } else if (saveMode === SaveMode.SaveAndClose) {
            formContext.data.entity.save("saveandclose");
          } else if (saveMode === SaveMode.SaveAndNew) {
            formContext.data.entity.save("saveandnew");
          }
          return response.json();
        } else {
          throw new Error("Validation failed.");
        }
      })
      .catch(function (error) {
        console.log("Plugin Exception: " + error.message);
        Xrm.Utility.alertDialog("Error: " + error.message);
      });
  }

  return {
    OnSave: validateContactInMarketingList,
  };
})();
