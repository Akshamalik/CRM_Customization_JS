//Function to update appointment status to Completed
function updateStatusAppointment(primaryControl) {
  let formContext = primaryControl;
  let functionName = "updateStatusAppointment";
  let appointmentId = "";
  let updateStatus;
  let confirmOptions = {text: "Do you want to mark the status of this record as Completed?",title: "Confirm Status Change",confirmButton: "Confirm",cancelButton: "Cancel",};
  try {
    //Validate formcontext
    if (!isValid(formContext)) return;
    //Opening dialog box
    Xrm.Navigation.openConfirmDialog(confirmOptions).then( function (result) {
        if (result.confirmed) {
          //Get appointment ID
          appointmentId = formContext.data.entity.getId().replace("{", "").replace("}", "");
          //Validate appointment ID
          if (!isValid(appointmentId)) return;
          //Update values inactive->1 , statuscode->completed(480020001)
          updateStatus = { statecode: 1,statuscode: 480020001,};
          //Generic update function
          updateRecord("fixer_appointment",appointmentId,updateStatus,function () {
              console.log("Status successfully updated to Completed");
              formContext.data.refresh(); // Refresh form after update
            }
          );
        } else {
          console.log("Status change cancelled by user");
        }
      },
      function (error) {
        console.error("Error opening confirmation dialog:", error.message);
      }
    );
  } catch (error) {
    console.error(`${functionName}:`, error.message);
  }
}

//Generic function to update record
function updateRecord(entityName, recordId, fieldsToUpdate, onSuccess) {
  let functionName = "updateRecord";
  try {
    Xrm.WebApi.updateRecord(entityName, recordId, fieldsToUpdate).then(
      function (result) {
        console.log(`Record updated successfully.`);
        if (onSuccess && typeof onSuccess === "function") {
          onSuccess(result);
        }
      },
      function (error) {
        Xrm.Utility.alertDialog(`Error: ${error.message}`);
      }
    );
  } catch (error) {
    console.log(`${functionName}`, error.message);
  }
}
//Generic function to validate attributes
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
    console.error(`${functionName}: Error during validation:`, error.message);
  }
  return valid;
}
