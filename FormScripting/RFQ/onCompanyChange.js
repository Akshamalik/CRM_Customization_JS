// Main function triggered on company change to filter the contact
function onCompanyChange(executionContext) {
  const functionName = "onCompanyChange";
  let formContext, companyLookup, contactField, companyId;
  try {
    // Validate and Get the formContext
    if (!isValid(executionContext) || !isValid(executionContext.getFormContext())) return;
    formContext = executionContext.getFormContext();
    // Validate the required fields
    if (!isValid(formContext.getAttribute("fixer_company")) || !isValid(formContext.getAttribute("fixer_contactperson"))) return;
    companyLookup = formContext.getAttribute("fixer_company").getValue();
    contactField = formContext.getAttribute("fixer_contactperson");
    companyId = companyLookup[0].id.replace(/[{}]/g, "");
    // Retrieve and set the primary contact
    retrieveAndSetPrimaryContact(companyId, contactField);
  } catch (error) {
    console.error(`Error in ${functionName}: ${error.message}`);
  }
}

// Function to retrieve primary contact and set it
function retrieveAndSetPrimaryContact(companyId, contactField) {
  const functionName = "retrieveAndSetPrimaryContact";
  try {
    if (!isValid(Xrm) || !isValid(Xrm.WebApi) || !isValid(Xrm.WebApi.retrieveRecord)) {
      throw new Error("Xrm.WebApi.retrieveRecord is not available");
    }
    Xrm.WebApi.retrieveRecord("account", companyId, "?$expand=primarycontactid($select=contactid,fullname)").then(
      function success(result) {
        try {
          if (result.primarycontactid && result.primarycontactid.contactid) {
            const primaryContact = [{
              id: result.primarycontactid.contactid,
              name: result.primarycontactid.fullname,
              entityType: "contact"
            }];
            contactField.setValue(primaryContact);
          } else {
            contactField.setValue(null);
          }
        } catch (innerError) {
          console.error(`${functionName} - Error processing result: ${innerError.message}`);
        }
      },
      function (error) {
        console.error(`${functionName} - Error retrieving record: ${error.message}`);
      }
    );
  } catch (error) {
    console.error(`Error in ${functionName}: ${error.message}`);
  }
}

// Utility function to check if a value is valid.
function isValid(value) {
  try {
    return value !== null && value !== undefined && value !== "undefined" && value !== "null" && value !== "";
  } catch (error) {
    console.error("isValid: " + error.message);
    return false;
  }
}
