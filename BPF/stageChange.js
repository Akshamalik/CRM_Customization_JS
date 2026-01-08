//this function move backward but not forward as it only chnages completed stages to active
//used setActiveStage
function AdvanceBPF(executionContext, retries = 5) {
  let functionName = "AdvanceBPF",formContext,stageChoiceAttr,stageChoice,stageIdMap,selectedStageId;
  try {
    if(!isValid(executionContext)) return;
    //Validate and get formcontext
    if(!isValid(executionContext.getFormContext())) return;
    formContext = executionContext.getFormContext();
    //Retry
    if (!formContext.data.process || !formContext.data.process.setActiveStage) {
      if (retries > 0) {
        setTimeout(function () {
          AdvanceBPF(executionContext, retries - 1);
        }, 500);
      } else {
        console.log("BPF not ready after retries.");
      }
      return;
    }
    //Validate and get stagechoice attribute
    if(!isValid(formContext.getAttribute("cr4d6_stagechanger"))) return;
    stageChoiceAttr = formContext.getAttribute("cr4d6_stagechanger");
    stageChoice = stageChoiceAttr.getText();
    //Map stage with their process ids
    stageIdMap = {
      "Stage 1": "67cca60a-2e8b-4af3-8447-b7ec1fa46213",
      "Stage 2": "829d166e-d216-47b5-9b07-781f6468b3f3",
      "Stage 3": "1bdc35f7-f602-4c1d-8122-397803b141d5",
    };
    //Validate and get selected stage id
    if(!isValid(stageIdMap[stageChoice])) return;
    selectedStageId = stageIdMap[stageChoice];
    setStage(formContext,selectedStageId,stageChoice)
    // Save if form is dirty
    if (formContext.data.entity.getIsDirty()) {
      formContext.data.save().then(function () {
        setStage(formContext,selectedStageId,stageChoice);
      });
    } else {
        setStage(formContext,selectedStageId,stageChoice);;
    }
  } catch (error) {
    console.log(`error in ${functionName}`, error.message);
  }
}
function setStage(formContext,selectedStageId,stageChoice) {
    let functionName="setStage";
    try {
        if(!isValid(formContext.data) || !isValid(formContext.data.process)) return;
        formContext.data.process.setActiveStage(selectedStageId,
            function (result) {
              debugger;
              if (result === "success") {
                console.log("Stage successfully set to:", stageChoice);
              } else {
                console.log("Failed to set stage. Result:", result);
              }
            }
        );
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
  