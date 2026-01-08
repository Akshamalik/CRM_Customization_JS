///this function is used for hiding/showing the reason for inactivity field based on the status field value
function toggleReasonForInactivity(executionContext) {
  let formContext, status;
  try {
    // Validation
    //Validate  Execution Context
    if(!isValid(executionContext)){return;}
    //Validate Form Context 
    if(!isValid(executionContext.getFormContext())){return;}
    //Get FormContext
    formContext = executionContext.getFormContext();
    //Validate Fixer Status 
    if(!isValid(formContext.getAttribute("fixer_status").getValue())){return;}  
    //Validate Fixer Reason for Inactivity  
    if(!isValid(formContext.getControl("fixer_reasonforinactivity"))){return;}  
    //Get status 
    status = formContext.getAttribute("fixer_status").getValue();  
    if(status ==2){
        formContext.getControl("fixer_reasonforinactivity").setVisible(true);
    }else{
        formContext.getControl("fixer_reasonforinactivity").setVisible(false);
        formContext.getAttribute("fixer_reasonforinactivity").setValue(""); 
    }
  } catch (error) {
    console.error("Error in toggleReasonForInactivity:", error.message);
  }
}

///this is generic function used to validate the attributes
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
