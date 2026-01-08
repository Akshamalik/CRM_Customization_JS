/// This function retrieves a single Contact record by Contact ID using Xrm.WebApi.retrieveRecord.
function retrieveSingleContactRecord(executionContext) {
  let formContext,fetchDetail,contactID,functionName = "retrieveSingleContactRecord";
  try {
    // Validate Execution Context
    if (!isValid(executionContext)) return;
    // Validate and Get Form Context
    if (!isValid(executionContext.getFormContext())) return;
    formContext = executionContext.getFormContext();

    // Get Contact ID from the form
    let GUID = isValid(formContext.data.entity.getId())? formContext.data.entity.getId(): null;
    if (isValid(GUID)) contactID = GUID.replace("{", "").replace("}", "");

    // Validate Contact ID
    if (!isValid(contactID)) return;

    fetchDetail = isValid(formContext.getAttribute("fixer_fetchdetails")) && isValid(formContext.getAttribute("fixer_fetchdetails").getValue()) ? formContext.getAttribute("fixer_fetchdetails").getValue() 
    : null;
    if (!isValid(fetchDetail)) return;
    
    if (fetchDetail === 1) retrieveRecord("contact",contactID,"?$select=firstname,lastname,emailaddress1");
  } catch (error) {
    console.error("Error in retrieveSingleContactRecord:",error.message + functionName);
  }
}

/// Generic function to retrieve a single record
function retrieveRecord(entityName, recordID, query) {
  let functionName = "retrieveRecord";
  try {
    // Validate XRM Web API
    if (
      !isValid(Xrm) ||
      !isValid(Xrm.WebApi) ||
      !isValid(Xrm.WebApi.retrieveRecord)
    ) {
      return;
    }

    Xrm.WebApi.retrieveRecord(entityName, recordID, query).then(
      function (result) {
        let contactName = result.firstname + " " + result.lastname;
        let contactEmail = result.emailaddress1;

        let message = `Contact Name: ${contactName}\nEmail: ${contactEmail}`;
        alertDialog(message, "Contact Details");
      },
      function (error) {
        console.error("Error retrieving record:", error.message + functionName);
        alertDialog("Failed to retrieve record.", "Error");
      }
    );
  } catch (error) {
    console.error("Something went wrong", error.message + functionName);
  }
}

/// Generic function used to alert messages
function alertDialog(text, title) {
  let functionName = "alertDialog";
  let alertStrings;

  try {
    if (!isValid(text) || !isValid(title)) {
      return;
    }

    // Initialize alert string
    alertStrings = {
      confirmButtonLabel: "OK",
      text: "" + text + "",
      title: "" + title + "",
    };

    // Validate XRM Web API
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
    console.error("Something went wrong", error.message + functionName);
  }
}

/// Generic function used to validate the attributes.
function isValid(attribute) {
  let functionName = "isValid";
  let valid = false;

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
