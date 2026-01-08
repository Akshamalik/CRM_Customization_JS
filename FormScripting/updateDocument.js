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
  
  function updateDocumentNumberLabel(executionContext) {
    // Declare variables outside the try-catch block
    var formContext, documentType, documentNumberControl;
    
    try {
      // Combined validation of required objects
      if (
        !isValid(executionContext) ||
        !isValid(executionContext.getFormContext()) ||
        !isValid(executionContext.getFormContext().getAttribute("fixer_documenttype")) ||
        !isValid(executionContext.getFormContext().getControl("fixer_documentnumber"))
      ) {
        return;
      }
      
      // Assign variables once validations pass
      formContext = executionContext.getFormContext();
      documentType = formContext.getAttribute("fixer_documenttype").getValue();
      documentNumberControl = formContext.getControl("fixer_documentnumber");
  
      // Optionally, log documentType for debugging
      // console.log("Document Type:", documentType);
  
      // Set label based on documentType numeric values
      if (documentType === 480020000) {
        documentNumberControl.setLabel("Invoice Number");
      } else if (documentType === 480020001) {
        documentNumberControl.setLabel("Receipt Number");
      } else {
        documentNumberControl.setLabel("Document Number");
      }
    } catch (error) {
      console.error("Error in updateDocumentNumberLabel:", error.message);
    }
  }
  