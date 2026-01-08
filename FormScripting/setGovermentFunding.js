async function setGovernmentFundingLookup(executionContext) {
  let formContext = executionContext.getFormContext(); // Get form context
  let fundingSourceAttr = formContext.getAttribute("fixer_fundingsource"); // Funding Source field
  let fundingLookupAttr = formContext.getAttribute("fixer_govermentfunding"); // Government Funding Lookup field

  if (!fundingSourceAttr || !fundingLookupAttr) return;

  let fundingSource = fundingSourceAttr.getValue();
  if (!fundingSource) return;

  let fundingText = fundingSourceAttr.getText(); // Get the selected text value (Federal, Provincial, Parliamentary)
  
  // Fetch the Government Funding record based on the Funding Source
  let fetchXml = `?fetchXml=<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='false'>
      <entity name='fixer_govermentfunding'>
          <attribute name='fixer_govermentfundingid' />
          <filter type='and'>
              <condition attribute='fixer_name' operator='eq' value='${fundingText}' />
          </filter>
      </entity>
  </fetch>`;

  try {
      let result = await Xrm.WebApi.retrieveMultipleRecords("fixer_govermentfunding", fetchXml);

      if (result.entities.length > 0) {
          let fundingId = result.entities[0]["fixer_govermentfundingid"];

          let lookupValue = [{
              id: fundingId,
              entityType: "fixer_govermentfunding",
              name: fundingText
          }];

          fundingLookupAttr.setValue(lookupValue); // Set the lookup field
      } else {
          fundingLookupAttr.setValue(null); // Clear lookup if no match found
      }
  } catch (error) {
      console.error("Error in setGovernmentFundingLookup:", error.message);
  }
}
