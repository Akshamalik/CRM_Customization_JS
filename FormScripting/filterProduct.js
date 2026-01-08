var storedRfqId = null;

function onLoad(executionContext) {
  var formContext = executionContext.getFormContext();

  storedRfqId =formContext.formContext.data.entity.getId().replace(/[{}]/g, "");

  // Register PreSearch filters
  formContext.getControl("fixer_product2").addPreSearch(function () {
    filterProductLookup(formContext);
  });

  formContext.getControl("fixer_supplier2").addPreSearch(function () {
    filterSupplierLookup(formContext);
  });
}

function filterProductLookup(formContext) {
  if (storedRfqId) {
    const filter = `
            <filter>
                <condition attribute="fixer_rfq" operator="eq" value="${storedRfqId}" />
            </filter>
        `;
    formContext
      .getControl("fixer_product2")
      .addCustomFilter(filter, "fixer_requestedproduct");
  }
}

function filterSupplierLookup(formContext) {
  if (storedRfqId) {
    const filter = `
            <filter>
                <condition attribute="fixer_rfq" operator="eq" value="${storedRfqId}" />
            </filter>
        `;
    formContext
      .getControl("fixer_supplier2")
      .addCustomFilter(filter, "fixer_supplier");
  }
}
