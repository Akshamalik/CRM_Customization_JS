function hideTabConditionally(executionContext) {
  let functionName = "hideTabConditionally";
  try {
    var formContext = executionContext.getFormContext();
    var tab = formContext.ui.tabs.get("tab_2");
    if (tab) {
      var status = formContext.getAttribute("fixer_status").getValue();
      if (status !== 1) {
        tab.setVisible(false);
      }
    }
  } catch (error) {}
}
/// Generic function to validate attributes
function isValid(attribute) {
  let functionName = "isValid",
    valid = false;

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
