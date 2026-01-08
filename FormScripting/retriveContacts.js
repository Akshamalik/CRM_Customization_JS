/// This function retrieves all contact records associated with a given Account using Xrm.WebApi.retrieveMultipleRecords.
function retrieveContactsForAccount(executionContext) {
    let formContext, retriveOption, accountID, GUID, functionName = "retrieveContactsForAccount";
  
    try {
      // Validate Execution Context
      if (!isValid(executionContext)) return;
      
      // Validate and Get Form Context
      if (!isValid(executionContext.getFormContext())) return;
      formContext = executionContext.getFormContext();
  
      // Get record ID
      GUID = isValid(formContext.data.entity) && isValid(formContext.data.entity.getId()) 
        ? formContext.data.entity.getId() 
        : null;
  
      if (isValid(GUID)) accountID = GUID.replace("{", "").replace("}", "");
  
      // Validate and Retrieve Attribute
      retriveOption=isValid(formContext.getAttribute("fixer_retrievecontacts")) && isValid(formContext.getAttribute("fixer_retrievecontacts").getValue()) ? formContext.getAttribute("fixer_retrievecontacts").getValue() : null;
  
      if (!isValid(retriveOption)) return;
      if (!isValid(accountID)) return;
      
      // Call function to retrieve contacts
      if (retriveOption == 1) {
        retrieveRecords("contact", accountID, `?$select=lastname,emailaddress1&$filter=_parentcustomerid_value eq '${accountID}'`);
      }
  
    } catch (error) {
      console.error("Error in retrieveContactsForAccount:", error.message, functionName);
    }
  }
  
  /// Generic function to retrieve records using Xrm.WebApi.retrieveMultipleRecords
  function retrieveRecords(entityName, accountID, filterQuery) {
    let functionName = "retrieveRecords";
    try {
      // Validate XRM WebAPI
      if (
        !isValid(Xrm) ||
        !isValid(Xrm.WebApi) ||
        !isValid(Xrm.WebApi.retrieveMultipleRecords)
      ) {
        return;
      }
  
      // Retrieve contacts associated with the account
      Xrm.WebApi.retrieveMultipleRecords(entityName, filterQuery).then(
        function success(results) {
          if (results.entities.length > 0) {
            let contactList = "Contacts Associated with Account:\n";
            results.entities.forEach((contact) => {
              contactList += `Name: ${contact.lastname || "N/A"}, Email: ${contact.emailaddress1 || "N/A"}\n`;
            });
  
            alertDialog(contactList, "Contact Details");
          } else {
            alertDialog("No contacts found for this account.", "Info");
          }
        },
        function (error) {
          alertDialog("Error retrieving contacts: " + error.message, "Error");
        }
      );
    } catch (error) {
      console.error("Something went wrong", error.message, functionName);
    }
  }
  
  /// Generic function to display alert messages
  function alertDialog(text, title) {
    let functionName = "alertDialog", alertStrings;
  
    try {
      if (!isValid(text) || !isValid(title)) {
        return;
      }
  
      // Initialize alert strings
      alertStrings = {
        confirmButtonLabel: "OK",
        text: text,
        title: title,
      };
  
      // Validate XRM Navigation API
      if (
        !isValid(Xrm) ||
        !isValid(Xrm.Navigation) ||
        !isValid(Xrm.Navigation.openAlertDialog)
      ) {
        return;
      }
  
      Xrm.Navigation.openAlertDialog(alertStrings).then(
        function (success) {
          console.log("Alert dialog closed");
        },
        function (error) {
          console.log(error.message);
        }
      );
    } catch (error) {
      console.error("Something went wrong", error.message, functionName);
    }
  }
  
  /// Generic function to validate attributes
  function isValid(attribute) {
    let functionName = "isValid", valid = false;
  
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
  