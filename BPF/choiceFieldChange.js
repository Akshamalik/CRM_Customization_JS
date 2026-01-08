function onFormLoad(executionContext) {
  let functionName = "onFormLoad";
  let formContext;
  try {
    if (!isValid(executionContext)) return;
    //Validate and get formcontext
    if (!isValid(executionContext.getFormContext())) return;
    formContext = executionContext.getFormContext();
    //Validate and add on stage change event
    if (!isValid(formContext.data) || !isValid(formContext.data.process))
      return;
    formContext.data.process.addOnStageChange(function () {
      updateStageChangerField(formContext);
    });
    // Optionally call once on load as well
    updateStageChangerField(formContext);
  } catch (error) {
    console.log(`error in ${functionName}`, error.message);
  }
}

function updateStageChangerField(formContext) {
  let functionName = "updateStageChangeField",activeStage,stageName,stageField;
  try {
    // Validate and get active stage
    if(!isValid(formContext.data) || !isValid(formContext.data.process)) return;
    activeStage = formContext.data.process.getActiveStage();
    if (!isValid(activeStage)) return;
    // Get stage name
    stageName = activeStage.getName();
    //Validate and get stageField
    if(!isValid(formContext.getAttribute("cr4d6_stagechanger"))) return;
    stageField = formContext.getAttribute("cr4d6_stagechanger");
    // Switch between cases
    switch (stageName) {
      case "Stage 1":
        stageField.setValue(423180000); //Stage 1
        break;
      case "Stage 2":
        stageField.setValue(423180001); //Stage 2
        break;
      case "Stage 3":
        stageField.setValue(423180002); //Stage 3
        break;
      default:
        stageField.setValue(null); // Clear if not matched
    }
    stageField.setSubmitMode("always");
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
