function updateFaxPreference(primaryControl) {
  console.log("Enter fax pref");
  var formContext = primaryControl;
  formContext.getAttribute("donotfax").setValue(true);
  console.log("Exit fax pref");
}

function updateEmailPreference(primaryControl) {
  console.log("Enter email pref");
  var formContext = primaryControl;
  formContext.getAttribute("donotemail").setValue(true);
  console.log("Exit email pref");
}

function updateBulkEmailPreference(primaryControl) {
  console.log("Enter bulk email pref");
  var formContext = primaryControl;
  formContext.getAttribute("donotbulkemail").setValue(true);
  console.log("Exit bulk email pref");
}

function updateCreditLimit(primaryControl) {
  console.log("Enter update credit limit directly");

  let formContext = primaryControl;
  let functionName = "updateCreditLimitDirectly";
  let recordId = "";
  let entityName = "account"; 

  try {
    // Validate form context
    if (!isValid(formContext)) return;

    // Get current record ID
    recordId = formContext.data.entity .getId().replace("{", "").replace("}", "");

    // Validate record ID
    if (!isValid(recordId)) return;

    // Example: Set credit limit to 50000
    let creditLimitFields = {
      creditlimit: 50000, // Replace with desired value or a dynamic fetch
    };

    // Call generic update function
    updateRecord(entityName, recordId, creditLimitFields, function () {
      Xrm.Utility.alertDialog("Credit Limit successfully updated.");
      formContext.data.refresh();
    });
  } catch (error) {
    console.error(`${functionName} error:`, error.message);
    Xrm.Utility.alertDialog(`Error: ${error.message}`);
  }

  console.log("Exit update credit limit directly");
}
function updateRecord(entityName, recordId, fieldsToUpdate, onSuccess) {
  try {
    Xrm.WebApi.updateRecord(entityName, recordId, fieldsToUpdate).then(
      function (result) {
        console.log(`Record updated successfully.`);
        if (onSuccess && typeof onSuccess === "function") {
          onSuccess(result);
        }
      },
      function (error) {
        Xrm.Utility.alertDialog(`Error updating record: ${error.message}`);
      }
    );
  } catch (error) {
    console.log(`updateRecord error:`, error.message);
  }
}
function isValid(attribute) {
  return (
    attribute !== null &&
    attribute !== undefined &&
    attribute !== "undefined" &&
    attribute !== "null" &&
    attribute !== ""
  );
}
