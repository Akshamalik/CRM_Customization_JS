/**
 * This function checks if an enrollment funding record already exists for the current year.
 * If a record exists, it will display an alert message to the user.
 */
async function checkEnrollmentFunding(executionContext) {
  let formContext,fetchXml, response,enrollmentId;
  
  try {
    // Validate execution context
    if (!isValid(executionContext)) return;
    if (!isValid(executionContext.getFormContext())) return;
    
    formContext = executionContext.getFormContext();
    
    // Fetch the enrollment lookup field value
    if (!isValid(formContext.getAttribute("fixer_enrollment"))) return;

    enrollmentId = formContext.getAttribute("fixer_enrollment").getValue()[0].id;
    console.log(enrollmentId)
    // Create FetchXML to query for existing enrollment funding records for this enrollment in the current year
    fetchXml = `
      <fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='false'>
        <entity name='fixer_enrollmentfunding'>
          <attribute name='fixer_enrollmentfundingid' />
          <attribute name='fixer_name' />
          <attribute name='createdon' />
          <order attribute='fixer_name' descending='false' />
          <filter type='and'>
            <condition attribute='fixer_enrollment' operator='eq' value='${enrollmentId}' />
            <condition attribute='createdon' operator='this-year'/>
          </filter>
        </entity>
      </fetch>`;
    console.log(fetchXml)
    
    // Fetch records
    response = await retrieveRecords("fixer_enrollmentfunding", fetchXml);
    
    // Check if records exist and display appropriate message
    if (response && response.entities.length > 0) {
      alertDialog(
        "Enrollment Funding already exists for the current year!",
        "Duplicate Warning"
      );
    } else {
      console.log("No existing funding record found");
    }
  } catch (error) {
    console.error("Error fetching Enrollment Funding records:", error);
  }
}

/**
 * Helper function to retrieve records using FetchXML
 */
async function retrieveRecords(entityName, fetchXml) {
  try {
    let fetchXmlQuery = "?fetchXml=" + encodeURIComponent(fetchXml);
    let response = await Xrm.WebApi.retrieveMultipleRecords(
      entityName,
      fetchXmlQuery
    );
    console.log("Retrieved Records:", response);
    return response;
  } catch (error) {
    console.error("Error retrieving records for entity ", entityName, error);
    return null;
  }
}

/**
 * Helper function to display an alert dialog
 */
function alertDialog(text, title) {
  try {
    if (!isValid(text) || !isValid(title)) return;
    let alertStrings = { confirmButtonLabel: "OK", text: text, title: title };
    if (
      !isValid(Xrm) ||
      !isValid(Xrm.Navigation) ||
      !isValid(Xrm.Navigation.openAlertDialog)
    )
      return;
    Xrm.Navigation.openAlertDialog(alertStrings).then(
      () => console.log("Alert dialog closed"),
      (error) => console.log(error.message)
    );
  } catch (error) {
    console.error("Error in alertDialog:", error.message);
  }
}

/**
 * Helper function to validate if a value exists
 */
function isValid(attribute) {
  return (
    attribute !== null &&
    attribute !== undefined &&
    attribute !== "undefined" &&
    attribute !== "null" &&
    attribute !== ""
  );
}