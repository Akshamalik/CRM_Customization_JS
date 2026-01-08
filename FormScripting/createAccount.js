/// This function creates a new Account record by fetching data from the form and using Xrm.WebApi.createRecord.
async function createContactRecord(executionContext) {
  let formContext, contactData, accountName, accountEmail, fetchXml, accountID, GUID, createContact, functionName = "createContactRecord";
 
  try {
    // Validate Execution Context
    if (!isValid(executionContext)) { return; }
    // Validate and Get Form Contex
    if (!isValid(executionContext.getFormContext())) { return; }
    formContext = executionContext.getFormContext();
 
    //Get Create Contact Value
    createContact = isValid(formContext.getAttribute("fixer_createcontact")) && isValid(formContext.getAttribute("fixer_createcontact").getValue()) ? formContext.getAttribute("fixer_createcontact").getValue() : null;
    //Get Name
    accountName = isValid(formContext.getAttribute("name")) && isValid(formContext.getAttribute("name").getValue()) ? formContext.getAttribute("name").getValue() : null;
    //Get Email
    accountEmail = isValid(formContext.getAttribute("emailaddress1")) && isValid(formContext.getAttribute("emailaddress1").getValue()) ? formContext.getAttribute("emailaddress1").getValue() : null;
 
    //Get record ID
    GUID = isValid(formContext.getAttribute) && isValid(formContext.data.entity.getId()) ? formContext.data.entity.getId() : null;
 
    if (isValid(GUID)) { accountID = GUID.replace("{", "").replace("}", ""); }
 
    fetchXml = "<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='false'>"+
  "<entity name='contact'>"+
    "<attribute name='fullname' />"+
    "<attribute name='contactid' />"+
    "<order attribute='fullname' descending='false' />"+
    "<filter type='and'>"+
      "<condition attribute='parentcustomerid' operator='eq' value='"+GUID+"' />"+
      "<condition attribute='statecode' operator='eq' value='0' />"+
    "</filter>"+
  "</entity>"+
"</fetch>";
 
    if (!isValid(createContact) || !isValid(accountName) || !isValid(accountEmail)) { return; }
 
    //Initialize Data
    contactData = {
      "firstname": "Created from Script",
      "lastname": "" + accountName + "",
      "emailaddress1": "" + accountEmail + "",
      "parentcustomerid_account@odata.bind": "accounts(" + accountID + ")"
    }
 
    //Validate Contact Data
    if (!isValid(contactData)) { return; }
 
    if (createContact == 1001) {
      retrieveRecords("contact",fetchXml,contactData,"contact");
    }
 
  } catch (error) {
    console.error("Error in createNewAccount:", error.message + functionName);
  }
}
 
/// Generic function to create record
function createRecord(entityName, data) {
  let functionName = "createRecord";
 
  try {
    //Validate XRM webapi
    if (!isValid(Xrm) || !isValid(Xrm.WebApi) || !isValid(Xrm.WebApi.createRecord)) { return; }
 
    // Create the new Account record using Xrm.WebApi.createRecord
    Xrm.WebApi.createRecord(entityName, data).then(
      function success(result) {
        alertDialog("The record has been created Successfully :-)", "Summary");
      },
      function (error) {
        alertDialog("Something went wrong.", "Summary");
      }
    );
 
  }
  catch (error) {
    console.error("Something went wrong", error.message + functionName);
  }
}
 
/// Generic function to retrieve records
async function retrieveRecords(entityName, fetchXml, fieldData, createdRecordEntity) {
  let functionName = "retrieveRecords";
  let recordCollection;
  try {
    //Validate parameters and retrieveRecord
    if (!isValid(Xrm) || !isValid(Xrm.WebApi) || !isValid(Xrm.WebApi.retrieveMultipleRecords)) { return; }
 
    fetchXml = "?fetchXml=" + encodeURIComponent(fetchXml);
 
    recordCollection = await Xrm.WebApi.retrieveMultipleRecords(entityName, fetchXml);
 
    //Validate Bookable resource collection
    if (recordCollection.entities.length < 1) {
    //Create Record
    createRecord(createdRecordEntity,fieldData);
      }
      else{
        alertDialog("Contact record already existed.", "Summary");
      }
 
  }
  catch (error) {
    console.error("Something went wrong", error.message + functionName);
  }
}
 
/// Generic function to used to alert messages
function alertDialog(text, title) {
  let functionName = "alertDialog";
  let alertStrings;
 
  try {
    if (!isValid(text) || !isValid(title)) { return; }
    //Initialize alert string
    alertStrings = { confirmButtonLabel: "Yes", text: "" + text + "", title: "" + title + "" };
 
    //Validate XRM webapi
    if (!isValid(Xrm) || !isValid(Xrm.Navigation) || !isValid(Xrm.Navigation.openAlertDialog)) { return; }
    Xrm.Navigation.openAlertDialog(alertStrings).then(
      function (success) {
        console.log("Alert dialog closed");
      },
      function (error) {
        console.log(error.message);
      }
    );
  }
  catch (error) {
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