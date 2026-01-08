//function to call action and prevent onsave event
var ContactValidationForm = (function () {
  //private varibales assigned
  let SaveMode = { Save: 1, SaveAndClose: 2, SaveAndNew: 59, Autosave: 70 };
  let isValidationNeeded = true;
  //function to invoke the action
  function validateContactInMarketingList(executionContext) {
    let functionName = "validateContactInMarketingList",saveMode,formContext,applicationType,contact,applicationTypeId,contactId,execute_fixer_ValidateApplicants_Request;
    try {
      if (!isValid(executionContext)) return;
      //to prevent looping
      if (executionContext.getEventArgs().isDefaultPrevented()) return;
      //Get the saveMode
      saveMode = executionContext.getEventArgs().getSaveMode();
      //Validate the saveMode and isValidationNeeded
      if (saveMode !== SaveMode.Save &&saveMode !== SaveMode.SaveAndClose &&
        saveMode !== SaveMode.SaveAndNew &&saveMode !== SaveMode.Autosave) return;
      if (!isValidationNeeded) {isValidationNeeded = true;return;}
      //Validate and get formContext
      if (!isValid(executionContext.getFormContext())) return;
      formContext = executionContext.getFormContext();
      //Validate and Get the applicationType and contact
      if (!isValid(formContext.getAttribute("fixer_applicationtype").getValue()) ||!isValid(formContext.getAttribute("fixer_contact").getValue())) return;
      applicationType = formContext.getAttribute("fixer_applicationtype").getValue();
      contact = formContext.getAttribute("fixer_contact").getValue();
      //Extract the ids
      applicationTypeId = applicationType[0].id.replace("{", "").replace("}", "");
      contactId = contact[0].id.replace("{", "").replace("}", "");
      //Structure the request
      execute_fixer_ValidateApplicants_Request = {
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
      //Prevent save before async validation completes
      executionContext.getEventArgs().preventDefault();
      //Execute the action
      //Validate and execute the action
      if (!isValid(Xrm.WebApi)) return;
      Xrm.WebApi.execute(execute_fixer_ValidateApplicants_Request)
      .then(function (response) {
        if (response.ok) {
          isValidationNeeded = false;
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
        Xrm.Utility.alertDialog("Error: " + error.message);
      });
    } catch (error) {
      console.log(`error in ${functionName}`, error.message);
    }
  }
  return {
    OnSave: validateContactInMarketingList,
  };
})();
// Utility function to check if a value is valid.
function isValid(attribute) {
  var functionName = "isValid";
  var valid = false;
  try {
    if (
      attribute !== null &&
      attribute !== undefined &&
      attribute !== "undefined" &&
      attribute !== "null" &&
      attribute !== ""
    ) {
      valid = true;
    }
  } catch (error) {
    console.error(functionName + ": " + error.message);
  }
  return valid;
}
