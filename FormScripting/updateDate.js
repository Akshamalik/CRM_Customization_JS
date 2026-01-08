function handleFBAConfirmationChange(executionContext) {
    var formContext = executionContext.getFormContext();
    var confirmField = formContext.getAttribute("tcp_fbaconfirmassessmentcomplete");

    if (!confirmField) return;

    var confirmValue = confirmField.getValue();

    var dateField = formContext.getAttribute("tcp_fbaconfirmationassessmentcompletedate");
    var userField = formContext.getAttribute("tcp_fbaconfirmationassessmentcompleteby");

    if (confirmValue === true) {
        // Set current date and current user
        var currentDate = new Date();
        dateField.setValue(currentDate);

        // Get current user info
        var userId = Xrm.Utility.getGlobalContext().userSettings.userId;
        var userName = Xrm.Utility.getGlobalContext().userSettings.userName;

        userField.setValue([
            {
                id: userId.replace(/[{}]/g, ""),
                name: userName,
                entityType: "systemuser"
            }
        ]);
    } else {
        // Clear both fields
        dateField.setValue(null);
        userField.setValue(null);
    }
}
function handleFBAConfirmationChangeNC(executionContext) {
    var formContext = executionContext.getFormContext();
    var confirmField = formContext.getAttribute("tcp_fbaconfirmnonconformancescclosed");

    if (!confirmField) return;

    var confirmValue = confirmField.getValue();

    var dateField = formContext.getAttribute("tcp_fbaconfirmationnonconformancescloseddate");
    var userField = formContext.getAttribute("tcp_fbaconfirmationnonconformancesclosedby");

    if (confirmValue === true) {
        // Set current date and current user
        var currentDate = new Date();
        dateField.setValue(currentDate);

        // Get current user info
        var userId = Xrm.Utility.getGlobalContext().userSettings.userId;
        var userName = Xrm.Utility.getGlobalContext().userSettings.userName;

        userField.setValue([
            {
                id: userId.replace(/[{}]/g, ""),
                name: userName,
                entityType: "systemuser"
            }
        ]);
    } else {
        // Clear both fields
        dateField.setValue(null);
        userField.setValue(null);
    }
}
function handleFBAConfirmationChangeFB(executionContext) {
    var formContext = executionContext.getFormContext();
    var confirmField = formContext.getAttribute("tcp_fbadeclarecompletedandpassforreview");

    if (!confirmField) return;

    var confirmValue = confirmField.getValue();

    var dateField = formContext.getAttribute("tcp_fbadeclarepassedforreviewdate");
    var userField = formContext.getAttribute("tcp_fbadeclarepassedforreviewby");

    if (confirmValue === true) {
        // Set current date and current user
        var currentDate = new Date();
        dateField.setValue(currentDate);

        // Get current user info
        var userId = Xrm.Utility.getGlobalContext().userSettings.userId;
        var userName = Xrm.Utility.getGlobalContext().userSettings.userName;

        userField.setValue([
            {
                id: userId.replace(/[{}]/g, ""),
                name: userName,
                entityType: "systemuser"
            }
        ]);
    } else {
        // Clear both fields
        dateField.setValue(null);
        userField.setValue(null);
    }
}


