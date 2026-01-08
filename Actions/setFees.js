function callSetFeesAction(executionContext) {
    var formContext = executionContext.getFormContext();
    var universityFee = formContext.getAttribute("fixer_universityfee").getValue(); 
    var courseLookup = formContext.getAttribute("fixer_course").getValue();
    if (!universityFee || !courseLookup) {
        Xrm.Utility.alertDialog("Please fill in both University Fee and Course Name.");
        return;
    }

    var actionName = "fixer_SetFees";

    var parameters = {
        "UniversityFee": universityFee,
        "CourseName": {
            "@odata.type": "Microsoft.Dynamics.CRM.fixer_course",
            "fixer_courseid": courseLookup[0].id
        }
    };

    var req = {
        method: "POST",
        url: "/api/data/v9.1/" + actionName,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json; charset=utf-8",
            "OData-MaxVersion": "4.0",
            "OData-Version": "4.0"
        },
        body: JSON.stringify(parameters)
    };

    Xrm.WebApi.online.execute(req).then(
        function success(response) {
            if (response.ok) {
                response.json().then(function (result) {
                    // Set the returned Course Fee and Total Fee on form
                    formContext.getAttribute("fixer_coursefee").setValue(result.CourseFee);
                    formContext.getAttribute("fixer_totalfee").setValue(result.TotalFee);
                    formContext.getAttribute("fixer_coursefee").setSubmitMode("always");
                    formContext.getAttribute("fixer_totalfee").setSubmitMode("always");
                });
            }
        },
        function (error) {
            console.error("Action failed: ", error.message);
            Xrm.Utility.alertDialog("Failed to call Set Fees Action: " + error.message);
        }
    );
}
