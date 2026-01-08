function markAppointmentAsFollowedUp(executionContext) {
    var formContext = executionContext.getFormContext();
    var appointmentId = formContext.data.entity.getId().replace("{", "").replace("}", "");

    var parameters = {
        AppointmentID: {
            "@odata.type": "Microsoft.Dynamics.CRM.appointment",
            appointmentid: appointmentId
        }
    };

    Xrm.WebApi.online.executeCustomAction("fixer_MarkAppointmentAsFollowedUp", parameters).then(
        function (response) {
            if (response.ok) {
                response.json().then(function (result) {
                    Xrm.Navigation.openAlertDialog({ text: result.ResultMessage });
                    formContext.data.refresh();
                });
            } else {
                console.log("Response not OK");
            }
        },
        function (error) {
            console.error("Action error:", error.message);
            Xrm.Navigation.openAlertDialog({ text: "Error occurred: " + error.message });
        }
    );
}
