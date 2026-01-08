// Function to clear values of subcategory and subsubcategory
function onCategoryChange(executionContext) {
    const functionName = "onCategoryChange";
    let formContext, subCategoryAttr, subSubCategoryAttr;

    try {
        if (!isValid(executionContext)) return;
        formContext = executionContext.getFormContext();
        if (!isValid(formContext)) return;

        subCategoryAttr = formContext.getAttribute("fixer_subcategory");
        subSubCategoryAttr = formContext.getAttribute("fixer_subsubcategory");

        if (isValid(subCategoryAttr)) {
            subCategoryAttr.setValue(null);
        }
        if (isValid(subSubCategoryAttr)) {
            subSubCategoryAttr.setValue(null);
        }

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
