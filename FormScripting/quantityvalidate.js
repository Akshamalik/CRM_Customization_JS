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
  
  function validateQuantity(executionContext) {
    // Declare variables outside the try-catch block
    var formContext, quantity, quantityControl;
    try {
      // Validate required objects using a combined condition
      if (
        !isValid(executionContext) ||
        !isValid(executionContext.getFormContext()) ||
        !isValid(executionContext.getFormContext().getAttribute("fixer_quantity")) ||
        !isValid(executionContext.getFormContext().getControl("fixer_quantity"))
      ) {
        return;
      }
  
      // Assign variables since validations passed
      formContext = executionContext.getFormContext();
      quantity = formContext.getAttribute("fixer_quantity").getValue();
      quantityControl = formContext.getControl("fixer_quantity");
  
      // Clear any previous notifications
      quantityControl.clearNotification();
  
      // Validate the quantity value
      if (quantity === null || quantity <= 0 || quantity >= 100) {
        var errorMessage = "Quantity must be greater than 0 and less than 100.";
        quantityControl.setNotification(errorMessage, "quantityError");
      }
    } catch (error) {
      console.error("Error in validateQuantity:", error.message);
    }
  }
  