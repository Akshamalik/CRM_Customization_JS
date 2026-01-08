//use moveNext() and movePrevious() to move stages according to stage changer field value
function switchStageAccordingToChoice(executionContext) {
    let functionName = "switchStageAccordingToChoice";
    let formContext, process, selectedStageNumber, stages, currentStageId;
    try {
        //Validate executioncontext,formcontext and get formcontext
        if (!isValid(executionContext)) return;
        if (!isValid(executionContext.getFormContext())) return;
        formContext = executionContext.getFormContext();
        //Validate and get process
        if (!isValid(formContext.data.process)) return;
        process = formContext.data.process;
        //Validate and get the choice field of stages
        if(!isValid(formContext.getAttribute("fixer_stagechanger").getValue())) return;
        selectedStageNumber = formContext.getAttribute("fixer_stagechanger").getValue();
        //Validate and get active path
        if (!isValid(process.getActivePath()) || !isValid(process.getActivePath().getId())) return;
        stages = process.getActivePath();
        currentStageId = process.getActiveStage().getId();
        //Generic function to move stages
        moveStages(process, stages, currentStageId, selectedStageNumber);
    } catch (e) {
        console.error(`Error in ${functionName}:`, e.message);
    }
}

//Generic function to move stages (the choice field should have same name as bpf and values 1,2,3)
function moveStages(process, stages, currentStageId, selectedStageNumber) {
    let functionName = "moveStages",currentIndex = -1,targetIndex = -1;
    try {
        //Get name of stage and assign current and target index
        stages.forEach((stage, index) => {
            const stageName = stage.getName().toLowerCase().trim();
            if (stage.getId() === currentStageId) currentIndex = index;
            if (stageName === `stage ${selectedStageNumber}`.toLowerCase().trim()) targetIndex = index;
        });
        //If not assigned return
        if (currentIndex === -1 || targetIndex === -1) return;
        //Move function to move stages with moveNext() and movePrevious()
        const move = () => {
            if (currentIndex < targetIndex) {
                process.moveNext(() => {
                    currentIndex++;
                    if (currentIndex < targetIndex) setTimeout(move, 800);
                }, (e) => console.error(`${functionName}: moveNext failed:`, e.message));
            } else if (currentIndex > targetIndex) {
                process.movePrevious(() => {
                    currentIndex--;
                    if (currentIndex > targetIndex) setTimeout(move, 800);
                }, (e) => console.error(`${functionName}: movePrevious failed:`, e.message));
            } else {
                console.log(`${functionName}: Already at the desired stage.`);
            }
        };
        move();
    } catch (error) {
        console.error(`${functionName}:`, error.message);
    }
}

// Utility function to validate input
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
        console.error(`${functionName}: ${error.message}`);
    }
    return valid;
}
