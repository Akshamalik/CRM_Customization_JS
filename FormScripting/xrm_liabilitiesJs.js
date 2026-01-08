function onChangeLiabilityType(executionContext) {
    var formContext = executionContext.getFormContext();
    var liabilityType = formContext.getAttribute("xrm_typeofliability").getValue();

    // ----------- Step 1: Clear all fields first -----------
    var fieldsToClear = [
        "xrm_name",
        "xrm_amountuptodate",
        "xrm_originalamount",
        "xrm_defaultdescription",
        "xrm_interestrate",
        "xrm_typeoflongtermdebt"
    ];

    fieldsToClear.forEach(function(field) {
        if (formContext.getAttribute(field)) {
            formContext.getAttribute(field).setValue(null);
            formContext.getAttribute(field).setSubmitMode("always");
        }
    });

    // ----------- Step 2: Hide all fields initially -----------
    var fieldsToHide = [
        "xrm_name",
        "xrm_amountuptodate",
        "xrm_originalamount",
        "xrm_defaultdescription",
        "xrm_interestrate",
        "xrm_typeoflongtermdebt"
    ];

    fieldsToHide.forEach(function(field) {
        if (formContext.getControl(field)) {
            formContext.getControl(field).setVisible(false);
        }
    });

    // ----------- Step 3: Apply Visibility Based on Type -----------
    if (liabilityType === 570690000) {
        // Current Liability
        formContext.getControl("xrm_name").setVisible(true);
        formContext.getControl("xrm_amountuptodate").setVisible(true);
        formContext.getControl("xrm_originalamount").setVisible(true);
        formContext.getControl("xrm_defaultdescription").setVisible(true);
        formContext.getControl("xrm_interestrate").setVisible(true);
    }
    else if (liabilityType === 570690001) {
        // Long-Term Liability
        formContext.getControl("xrm_name").setVisible(true);
        formContext.getControl("xrm_typeoflongtermdebt").setVisible(true);
        formContext.getControl("xrm_defaultdescription").setVisible(true);
    }
}



function onChangeLongTermDebtType(executionContext) {
    var formContext = executionContext.getFormContext();
    var debtType = formContext.getAttribute("xrm_typeoflongtermdebt").getValue();

    // ----------- Step 1: Clear all related fields -----------
    var fieldsToClear = [
        "xrm_amountuptodate",
        "xrm_originalamount",
        "xrm_interestrate",
        "xrm_currentbookvalue",
        "xrm_issuedamount",
        "xrm_annualinterestrate",
        "xrm_maturitydate",
        "xrm_annualinterestpaymentvalue",
        "xrm_debtrating",
        "xrm_debttype",
        "xrm_debthierarchy",
        "xrm_issuancedate",
        "xrm_timetomaturity",
    ];

    fieldsToClear.forEach(function(field) {
        if (formContext.getAttribute(field)) {
            formContext.getAttribute(field).setValue(null);
            formContext.getAttribute(field).setSubmitMode("always");
        }
    });

    // ----------- Step 2: Hide all fields initially -----------
    var fieldsToHide = fieldsToClear; // same list
    fieldsToHide.forEach(function(field) {
        if (formContext.getControl(field)) {
            formContext.getControl(field).setVisible(false);
        }
    });


    // ----------- Step 3: Show fields based on selection -----------
    if (debtType === false) {
        // ✅ OTHER Selected → Show Short fields
        formContext.getControl("xrm_amountuptodate").setVisible(true);
        formContext.getControl("xrm_originalamount").setVisible(true);
        formContext.getControl("xrm_interestrate").setVisible(true);
    }
    else if (debtType === true) {
        // ✅ DEBT Selected → Show Full Debt Details
        formContext.getControl("xrm_timetomaturity").setVisible(true);
        formContext.getControl("xrm_currentbookvalue").setVisible(true);
        formContext.getControl("xrm_issuedamount").setVisible(true);
        formContext.getControl("xrm_annualinterestrate").setVisible(true);
        formContext.getControl("xrm_maturitydate").setVisible(true);
        formContext.getControl("xrm_annualinterestpaymentvalue").setVisible(true);
        formContext.getControl("xrm_debtrating").setVisible(true);
        formContext.getControl("xrm_debttype").setVisible(true);
        formContext.getControl("xrm_debthierarchy").setVisible(true);
        formContext.getControl("xrm_issuancedate").setVisible(true);
    }
}

function openNewLiability(primaryControl, selectedControl) {
    var formContext = primaryControl;

    // Step 1: Detect which section/subgrid is the source
    var sourceSectionName = "";
    formContext.ui.tabs.forEach(function (tab) {
        tab.sections.forEach(function (section) {
            section.controls.forEach(function (control) {
                if (control === selectedControl) {
                    sourceSectionName = section.getName();
                }
            });
        });
    });

    // Step 2: Get current asset (parent) details
    var assetId = formContext.data.entity.getId();
    var assetName = formContext.data.entity.getPrimaryAttributeValue();
    var cleanAssetId = assetId ? assetId.replace(/[{}]/g, "") : null;

    // Step 3: Prepare parameters to pass to Liability form
    var formParameters = {
        "passed_assetId": cleanAssetId,
        "passed_assetName": assetName
    };

    // Step 4: Set liability type based on source section
    // Replace these section names with your actual section names
    if (sourceSectionName === "CurrentLiabilities") {
        formParameters["passed_liabilityType"] = 570690000; // Current
    }
    else if (sourceSectionName === "LongTermLiabilities") {
        formParameters["passed_liabilityType"] = 570690001; // Long-Term
    }
    console.log(sourceSectionName);
    console.log(formParameters["passed_liabilityType"]);
    // Step 5: Open Liability form
    var entityFormOptions = {
        entityName: "xrm_liability", // your liability entity
        useQuickCreateForm: false
    };

    Xrm.Navigation.openForm(entityFormOptions, formParameters);
}
function Liability_OnLoad(executionContext){
    var formContext = executionContext.getFormContext();
    var params = Xrm.Utility.getGlobalContext().getQueryStringParameters();

    // Set Asset Lookup
    if(params["passed_assetId"] && formContext.getAttribute("xrm_asset")){
        formContext.getAttribute("xrm_asset").setValue([
            {
                id: params["passed_assetId"],
                name: decodeURIComponent(params["passed_assetName"]),
                entityType: "xrm_asset"
            }
        ]);
    }

    // Set Liability Type
    if(params["passed_liabilityType"] && formContext.getAttribute("xrm_liabilitytype")){
        formContext.getAttribute("xrm_typeofliability").setValue(parseInt(params["passed_liabilityType"]));
    }
}
