function changeAccountType(executionContext) {
    let functionName="changeAccountType";
    let formContext,accountType,activeProcess,activeProcessId; 
    try {
      // Validate executionContext
      if(!isValid(executionContext)) return;
      // Validate formContext
      if(!isValid(executionContext.getFormContext())) return;
      formContext = executionContext.getFormContext();
      // Validate and get account attribute
      if(!isValid(formContext.getAttribute("fixer_accounttype").getValue())) return;
      accountType = formContext.getAttribute("fixer_accounttype").getValue();
      // Validate and get activeProcess and its ID
      if(!isValid(formContext.data) || !isValid(formContext.data.process) ||!isValid(formContext.data.process.getActiveProcess()) || !isValid(formContext.data.process.getActiveProcess().getId())) return;
      activeProcess = formContext.data.process.getActiveProcess();
      activeProcessId = activeProcess.getId().toUpperCase();
      //Switch Bpf
      switchBpf(accountType,activeProcessId,formContext)
    } catch (error) {
      console.error(`Error in ${functionName}`, error.message);
    }
  }
  
  function switchBpf(accountType,activeProcessId,formContext){
    // Switch Business Process Flow based on account type
    let functionName="switchBpf"
    try {
        if(!isValid(formContext.data) || !isValid(formContext.data.process)) return;
        if (accountType !== null) {
            // Parent
            if (accountType === 480020000 && activeProcessId !== "E5C2F333-0120-F011-9989-000D3AC9B8DE") {
              formContext.data.process.setActiveProcess("E5C2F333-0120-F011-9989-000D3AC9B8DE", "success");
            }
            // Student
            else if (accountType === 480020001 && activeProcessId !== "F1B3F242-0120-F011-9989-000D3AC9B8DE") {
              formContext.data.process.setActiveProcess("F1B3F242-0120-F011-9989-000D3AC9B8DE", "success");
            }
        }
    } catch (error) {
        console.log(`error in ${functionName}`,error.message)
    }   
  }
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
  