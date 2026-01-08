function setProductCodeBasedOnName(executionContext) {
  var formContext, productName, productCodeAttr;
  try {
    if (
      !isValid(executionContext) ||
      !isValid(executionContext.getFormContext()) ||
      !isValid(executionContext.getFormContext().getAttribute("fixer_name")) ||
      !isValid(
        executionContext.getFormContext().getAttribute("fixer_productcode")
      )
    ) {
      return;
    }
    formContext = executionContext.getFormContext();
    productName = formContext.getAttribute("fixer_name").getValue();
    productCodeAttr = formContext.getAttribute("fixer_productcode");

    if (productName === "Laptop") {
      productCodeAttr.setValue("PRD-001");
    } else {
      productCodeAttr.setValue(null);
    }
  } catch (error) {
    console.error("Error in setProductCodeBasedOnName:", error.message);
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