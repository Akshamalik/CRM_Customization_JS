let hasStockCodeHandled = false;

function checkOrGenerateStockCode(executionContext) {
  const functionName = "checkOrGenerateStockCode";
  let formContext, mpn, dpn, stockCodeAttr, saveEvent;

  try {
    if (!isValid(executionContext)) return;

    formContext = executionContext.getFormContext();
    saveEvent = executionContext.getEventArgs();

    if (!isValid(formContext)) return;

    const mpnAttr = formContext.getAttribute("fixer_manufacturerpartnumber");
    const dpnAttr = formContext.getAttribute("fixer_distributorpartnumber");
    stockCodeAttr = formContext.getAttribute("fixer_acuutechstockcode");

    if (!isValid(mpnAttr) || !isValid(dpnAttr) || !isValid(stockCodeAttr)) return;

    mpn = mpnAttr.getValue();
    dpn = dpnAttr.getValue();

    // If no MPN or DPN, let the save continue without interference
    if (!isValid(mpn) && !isValid(dpn)) return;

    // If stock code already exists, let save proceed (no generation required)
    if (isValid(stockCodeAttr.getValue())) return;

    // preventDefault ONLY if we need async to finish first
    if (saveEvent && typeof saveEvent.preventDefault === "function") {
      saveEvent.preventDefault();
    }

    // Ensure this logic only runs once per session
    if (hasStockCodeHandled) return;
    hasStockCodeHandled = true;

    handleStockCodeAsync(mpn, dpn).then((generatedCode) => {
      if (generatedCode) {
        stockCodeAttr.setValue(generatedCode);
      }

      // Resume save manually after async completes
      formContext.data.save();
    });

  } catch (error) {
    console.error(`Error in ${functionName}: ${error.message}`);
  }
}

// Async handler to check or generate stock code
async function handleStockCodeAsync(mpn, dpn) {
  if (isValid(mpn)) {
    const existingMPN = await checkMPN(mpn);
    if (existingMPN) return existingMPN;
  }

  if (isValid(dpn)) {
    const existingDPN = await checkDPN(dpn);
    if (existingDPN) return existingDPN;
  }

  // No match found – generate new code
  return generateNewStockCode();
}

// Web API call to check MPN
function checkMPN(mpn) {
  return Xrm.WebApi.retrieveMultipleRecords("fixer_rfq", `?$select=fixer_acuutechstockcode&$filter=fixer_manufacturerpartnumber eq '${mpn}'`)
    .then(result => result.entities?.[0]?.fixer_acuutechstockcode || null)
    .catch(error => {
      console.error(`Error in checkMPN: ${error.message}`);
      return null;
    });
}

// Web API call to check DPN
function checkDPN(dpn) {
  return Xrm.WebApi.retrieveMultipleRecords("fixer_rfq", `?$select=fixer_acuutechstockcode&$filter=fixer_distributorpartnumber eq '${dpn}'`)
    .then(result => result.entities?.[0]?.fixer_acuutechstockcode || null)
    .catch(error => {
      console.error(`Error in checkDPN: ${error.message}`);
      return null;
    });
}

// Generate new stock code
function generateNewStockCode() {
  const prefix = "ASC";
  const random = Math.floor(100000 + Math.random() * 900000); // 6-digit
  return `${prefix}-${random}`;
}

// Utility to check null/undefined/empty
function isValid(value) {
  return value !== null && value !== undefined && value !== "" && value !== "null" && value !== "undefined";
}
