async function createStudentRecord(executionContext) {
  let formContext, studentData, parentName, parentEmail, fetchXml, parentID, GUID, createStudent, functionName = "createStudentRecord";
 
  try {
    // Validate Execution Context
    if (!isValid(executionContext)) { return; }
    // Validate and Get Form Context
    if (!isValid(executionContext.getFormContext())) { return; }
    formContext = executionContext.getFormContext();
 
    // Get Create Student Value
    createStudent = isValid(formContext.getAttribute("fixer_createstudent")) && isValid(formContext.getAttribute("fixer_createstudent").getValue()) ? formContext.getAttribute("fixer_createstudent").getValue() : null;
    console.log(createStudent)
    // Get Parent Name
    parentName = isValid(formContext.getAttribute("fixer_name")) && isValid(formContext.getAttribute("fixer_name").getValue()) ? formContext.getAttribute("fixer_name").getValue() : null;
    // Get Parent Email
    parentEmail = isValid(formContext.getAttribute("fixer_email")) && isValid(formContext.getAttribute("fixer_email").getValue()) ? formContext.getAttribute("fixer_email").getValue() : null;
 
    // Get record ID
    GUID = isValid(formContext.data.entity.getId()) ? formContext.data.entity.getId() : null;
 
    if (isValid(GUID)) { parentID = GUID.replace("{", "").replace("}", ""); }
    console.log(parentID)
 
    fetchXml = "<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='false'>" +
      "<entity name='fixer_student'>" +
      "<attribute name='fixer_studentid' />" +
      "<attribute name='fixer_name' />" +
      "<attribute name='createdon' />" +
      "<order attribute='fixer_name' descending='false' />" +
      "<filter type='and'>" +
      "<condition attribute='fixer_parentname' operator='eq'  value='" + GUID + "' />" +
      "<condition attribute='statecode' operator='eq' value='0' />" +
      "</filter>" +
      "</entity>" +
      "</fetch>";
      console.log(fetchXml)
 
    if (!isValid(createStudent) || !isValid(parentName) || !isValid(parentEmail)) { return; }
     
    // Initialize Data
    studentData = {
      "fixer_name": "Created from Script",
      "fixer_firstname": parentName,
      "fixer_email": parentEmail,
      "fixer_ParentName@odata.bind": "/fixer_parents(" + parentID + ")"
    };
    console.log(studentData)
 
    // Validate Student Data
    if (!isValid(studentData)) { return; }
 
    if (createStudent == 1001) {
      retrieveRecords("fixer_student", fetchXml, studentData, "fixer_student");
    }
 
  } catch (error) {
    console.error("Error in " + functionName + ":", error.message);
  }
}
 
function createRecord(entityName, data) {
  let functionName = "createRecord";
 
  try {
    // Validate XRM webapi
    if (!isValid(Xrm) || !isValid(Xrm.WebApi) || !isValid(Xrm.WebApi.createRecord)) { return; }
 
    // Create the new Student record using Xrm.WebApi.createRecord
    Xrm.WebApi.createRecord(entityName, data).then(
      function success(result) {
        alertDialog("The record has been created successfully :-)", "Summary");
      },
      function (error) {
        alertDialog("Something went wrong: " + error.message, "Summary");
      }
    );
 
  } catch (error) {
    console.error("Error in " + functionName + ":", error.message);
  }
}
 
async function retrieveRecords(entityName, fetchXml, fieldData, createdRecordEntity) {
  let functionName = "retrieveRecords";
  let recordCollection;
  try {
    // Validate parameters and retrieveRecord
    if (!isValid(Xrm) || !isValid(Xrm.WebApi) || !isValid(Xrm.WebApi.retrieveMultipleRecords)) { return; }
 
    fetchXml = "?fetchXml=" + encodeURIComponent(fetchXml);
 
    recordCollection = await Xrm.WebApi.retrieveMultipleRecords(entityName, fetchXml);
 
    // Validate student resource collection
    if (recordCollection.entities.length < 1) {
      // Create Record
      createRecord(createdRecordEntity, fieldData);
    } else {
      alertDialog("Student record already existed.", "Summary");
    }
 
  } catch (error) {
    console.error("Error in " + functionName + ":", error.message);
  }
}
 
function alertDialog(text, title) {
  let functionName = "alertDialog";
  let alertStrings;
 
  try {
    if (!isValid(text) || !isValid(title)) { return; }
    // Initialize alert string
    alertStrings = { confirmButtonLabel: "Yes", text: text, title: title };
 
    // Validate XRM webapi
    if (!isValid(Xrm) || !isValid(Xrm.Navigation) || !isValid(Xrm.Navigation.openAlertDialog)) { return; }
    Xrm.Navigation.openAlertDialog(alertStrings).then(
      function (success) {
        console.log("Alert dialog closed");
      },
      function (error) {
        console.log(error.message);
      }
    );
  } catch (error) {
    console.error("Error in " + functionName + ":", error.message);
  }
}
 
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
