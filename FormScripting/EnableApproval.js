function toggleApprovalComments(executionContext) {
  var formContext, isApproved, approvalCommentsControl;
  try {
    // Validation
    if (
      !isValid(executionContext) ||
      !isValid(executionContext.getFormContext()) ||
      !isValid(
        executionContext.getFormContext().getAttribute("fixer_isapproved")
      ) ||
      !isValid(
        executionContext.getFormContext().getControl("fixer_approvalcomments")
      )
    ) {
      return;
    }

    // Now assign variables
    formContext = executionContext.getFormContext();
    isApproved = formContext.getAttribute("fixer_isapproved").getValue();
    approvalCommentsControl = formContext.getControl("fixer_approvalcomments");

    // yes -> 1 and no -> 0
    if (isApproved === 1) {
      approvalCommentsControl.setDisabled(false);
    } else {
      approvalCommentsControl.setDisabled(true);
      formContext.getAttribute("fixer_approvalcomments").setValue("");
    }
  } catch (error) {
    console.error("Error in toggleApprovalComments:", error.message);
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
