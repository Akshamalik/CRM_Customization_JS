function handleDueDateChange(executionContext) {
  let functionName = "handleDueDateChange",formContext,dueDate,currentDate,currentStatus;
  try {
    if(!isValid(executionContext)) return;
    if(!isValid(executionContext.getFormContext())) return;
    formContext = executionContext.getFormContext();
    if(!isValid(formContext.getAttribute("scheduledend")) || !isValid(formContext.getAttribute("scheduledend").getValue())) return;
    dueDate = formContext.getAttribute("scheduledend").getValue();
    currentDate = new Date();
    // If dueDate is in the future
    if (dueDate > currentDate) {
      // Check current status
      if(!isValid(formContext.getAttribute("statuscode")) || !isValid(formContext.getAttribute("statuscode").getValue())) return;
      currentStatus = formContext.getAttribute("statuscode").getValue();
      if (currentStatus !== 3) {
        formContext.getAttribute("statuscode").setValue(3); // Set to 'Open'
        
      }
    }
  } catch (error) {
    console.error("Error in",functionName + error.message)
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
