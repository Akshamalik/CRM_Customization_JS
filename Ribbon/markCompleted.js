//Mark selected appointments as Completed
async function markSelectedAppointmentsAsCompleted(selectedControl) {
    let functionName = "markSelectedAppointmentsAsCompleted";
    let selectedRows, selectedIds, message, completed = 0, alreadyCompleted = 0, processedCount = 0,STATUS_COMPLETED = 480020001,updateStatus ;
    try {
      // Validate selectedControl
      if (!isValid(selectedControl)) return;
      // Get selected rows from subgrid
      selectedRows = selectedControl.getGrid().getSelectedRows();
      selectedIds = selectedRows.getAll().map((row) =>row.getData().getEntity().getId().replace(/[{}]/g, ""));
      // Validate if any rows selected
      if (!isValid(selectedIds.length)) return;
      // Show confirmation dialog
      message = `Do you want to mark ${selectedIds.length} appointment(s) as completed?`;
      showConfirmDialog("Confirm Mark as Completed", message, (result) => {
        //if canceled return
        if (!result.confirmed) return; 
        //progressbar opened 
        showProgress("Processing appointments...");
        //loop through each record
        selectedIds.forEach(id => {
          retrieveRecord("fixer_appointment", id, "statuscode",
            (record) => {
              //if already marked completed
              if (record.statuscode === STATUS_COMPLETED) {
                alreadyCompleted++;
                finalize();
              } 
              //if not marked completed
              else {
                updateStatus = { statecode: 1, statuscode: STATUS_COMPLETED };
                updateRecord("fixer_appointment", id, updateStatus, () => {completed++;finalize();});
              }
            },() => finalize() // onError
          );
        });
        //finalize function to update variables
        const finalize = () => {
          processedCount++;
          if (processedCount === selectedIds.length) {
            closeProgress();
            showAlertDialog("Summary",`${completed} marked as Completed.\n${alreadyCompleted} already Completed.`);
            selectedControl.refresh();
          }
        };
      });
    } catch (error) {
      console.error(`${functionName}:`, error.message);
    }
  }

  // Generic function to retrieve a record
  function retrieveRecord(entityName, recordId, selectFields, onSuccess, onError) {
    let functionName = "retrieveRecord",query;
    try {
      if (!isValid(Xrm) || !isValid(Xrm.WebApi)) return; 
      query = selectFields ? `?$select=${selectFields}` : "";
      Xrm.WebApi.retrieveRecord(entityName, recordId, query)
        .then((record) => {
          if (onSuccess && typeof onSuccess === "function") {
            onSuccess(record);
          }
        })
        .catch((error) => {
          console.error(`${functionName} - Error:`, error.message);
          if (onError && typeof onError === "function") {
            onError(error);
          }
        });
    } catch (error) {
      console.error(`${functionName}:`, error.message);
    }
  }
  

  // Generic function to update a record
  function updateRecord(entityName, recordId, fieldsToUpdate, onSuccess) {
    let functionName = "updateRecord";
    try {
      if (!isValid(Xrm) || !isValid(Xrm.WebApi)) return; 
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
      console.log(`${functionName}:`, error.message);
    }
  }
  
  //Dialogbox function 
  function showConfirmDialog(title, text, callback) {
    let functionName="showConfirmDialog",confirmOptions;
    try {
      if (!isValid(Xrm) || !isValid(Xrm.Navigation)) return;
      confirmOptions = {title: title,text: text,confirmButtonLabel:"OK",cancelButtonLabel:"Cancel",};
      Xrm.Navigation.openConfirmDialog(confirmOptions)
        .then(callback)
        .catch((error) => {
          console.error("Error opening confirmation dialog:", error.message);
        });
    } catch (error) {
      console.error(`${functionName}`, error.message);
    }
  }
  
  //Progress bar start
  function showProgress(message) {
    let functionName="showProgress"
    try {
        if (!isValid(Xrm) || !isValid(Xrm.Utility)) return;
        Xrm.Utility.showProgressIndicator(message || "Processing...");
    } catch (error) {
        console.log(`${functionName}`,error.message)
    }   
  }
  
  //End/Close progress bar
  function closeProgress() {
    let functionName="closeProgress"
    try {
        if (!isValid(Xrm) || !isValid(Xrm.Utility)) return;
        Xrm.Utility.closeProgressIndicator();
    } catch (error) {
        console.log(`${functionName}`,error.message)
    }   
  }
  
  function showAlertDialog(title, text) {
    let functionName="showAlertDialog"
    try {
      if (!isValid(Xrm) || !isValid(Xrm.Navigation)) return;
      Xrm.Navigation.openAlertDialog({title: title || "Alert",text: text || "Something happened.",});
    } catch (error) {
      console.error(`${functionName}`, error.message);
    }
  }
  
  //Generic function to validate
  function isValid(attribute) {
    try {
      return (
        attribute !== null && attribute !== undefined && attribute !== "undefined" && attribute !== "null" && attribute !== "" );
    } catch (error) {
      return false;
    }
  }
  