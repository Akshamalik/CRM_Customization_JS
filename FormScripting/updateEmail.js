/// This function updates the email address of a Contact record using Xrm.WebApi.updateRecord.
function updateContactEmail(executionContext) {
  let formContext,
    emailField,
    contactId,
    updatedEmail,
    contactData,
    updateOption;

  try {
    // Validate the execution context and form context
    if (!isValid(executionContext)) {
      return;
    }

    if (!isValid(executionContext.getFormContext())) {
      return;
    }
    formContext = executionContext.getFormContext();

    // Validate the email field and ensure it has a value
    if (
      !isValid(formContext.getAttribute("emailaddress1")) ||
      !isValid(formContext.getAttribute("emailaddress1").getValue())
    ) {
      return;
    }
    let emailAttribute = formContext.getAttribute("emailaddress1");
    emailField = emailAttribute.getValue();

    // Validate and get the Contact ID
    if (!isValid(formContext.data.entity.getId())) {
      return;
    }
    let entityId = formContext.data.entity.getId();
    contactId = entityId.replace("{", "").replace("}", ""); // Remove braces from ID

    // Validate the update option field
    if (
      !isValid(formContext.getAttribute("fixer_updatetheemail")) ||
      !isValid(formContext.getAttribute("fixer_updatetheemail").getValue())
    ) {
      return;
    }
    let updateAttribute = formContext.getAttribute("fixer_updatetheemail");
    updateOption = updateAttribute.getValue();

    // If update option is set to 1 (Yes), update the email
    if (updateOption === 1) {
      updatedEmail = "aksha5u786@gmail.com";
      contactData = { emailaddress1: updatedEmail }; // Corrected object property

      // Call Xrm.WebApi.updateRecord to update the email
      Xrm.WebApi.updateRecord("contact", contactId, contactData).then(
        function success(result) {
          alert("Email updated successfully!");
          emailAttribute.setValue(updatedEmail);
          formContext.data.refresh();
        },
        function (error) {
          console.error("Error updating email: " + error.message);
          alert("Error updating email: " + error.message);
        }
      );
    }
  } catch (e) {
    console.error("Error in updateContactEmail: " + e.message);
    alert("Error in updateContactEmail: " + e.message);
  }
}

/// Generic function to validate attributes.
function isValid(attribute) {
  try {
    return (
      attribute !== null &&
      attribute !== undefined &&
      attribute !== "undefined" &&
      attribute !== "null" &&
      attribute !== ""
    );
  } catch (error) {
    console.error("Validation error: " + error.message);
    return false;
  }
}
