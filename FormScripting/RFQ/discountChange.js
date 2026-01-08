// Funtion to update the total sum of rfq if discount change
function onDiscountChange(executionContext) {
    let functionName = "onDiscountChange",formContext,totalSumAttr,discountAttr,total,discount,finalAmount;
    try {
        // Validate and Get formContext and executionContext
        if (!isValid(executionContext)) return;
        if (!isValid(executionContext.getFormContext())) return;
        formContext = executionContext.getFormContext();
        // Validate and Get discounted and totalsum fields
        if (!isValid(formContext.getAttribute("fixer_totalsum").getValue()) || !isValid(formContext.getAttribute("fixer_discountedamount").getValue())) return;
        totalSumAttr=formContext.getAttribute("fixer_totalsum")
        total = formContext.getAttribute("fixer_totalsum").getValue()
        discount = formContext.getAttribute("fixer_discountedamount").getValue()
        // Set the finalamount
        finalAmount = total - discount;
        totalSumAttr.setValue(finalAmount >= 0 ? finalAmount : 0);
    } catch (error) {
        console.error(`Error in ${functionName}: ${error.message}`);
    }
}

// Utility function to check if a value is valid.
function isValid(value) {
  try {
    return value !== null && value !== undefined && value !== "undefined" && value !== "null" && value !== "";
  } catch (error) {
    console.error("isValid: " + error.message);
    return false;
  }
}
