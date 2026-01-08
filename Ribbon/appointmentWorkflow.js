function updateStatusAppointment(primaryControl) {
    debugger;
    var formContext = primaryControl;
    var guid = formContext.data.entity.getId();

    // Show confirmation popup
    var confirmMessage = "Do you want to change the status to completed?";
    var confirmOptions = { height: 200, width: 400 };

    Xrm.Navigation.openConfirmDialog({ text: confirmMessage }, confirmOptions).then(function (result) {
        if (result.confirmed) {
            console.log("User confirmed, proceeding with workflow execution.");

            var executeWorkflowRequest = {
                entity: {
                    id: "9456B25E-4B11-F011-998A-002248D5DE4D", // Workflow ID
                    entityType: "workflow"
                },
                EntityId: {guid}, // Pass GUID as a string
                getMetadata: function () {
                    return {
                        boundParameter: "entity",
                        parameterTypes: {
                            "entity": {
                                typeName: "mscrm.workflow",
                                structuralProperty: 5
                            },
                            "EntityId": {
                                typeName: "Edm.Guid",
                                structuralProperty: 1
                            }
                        },
                        operationType: 0,
                        operationName: "ExecuteWorkflow"
                    };
                }
            };

            Xrm.WebApi.online.execute(executeWorkflowRequest).then(
                function success(result) {
                    if (result.ok) {
                        Xrm.Utility.alertDialog("Status changed to Completed.");
                        formContext.data.refresh(true);
                    }
                },
                function (error) {
                    console.error(error);
                    Xrm.Utility.alertDialog("Execution error: " + error.message);
                }
            );
        } else {
            console.log("User canceled the operation.");
        }
    });
}
