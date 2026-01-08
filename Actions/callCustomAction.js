function CallCustomActionFromJs() {
    var globalContext = Xrm.Utility.getGlobalContext();
    var serverURL = globalContext.getClientUrl();
    var actionName = "fixer_CustomAction"; 

    var inputPara = globalContext.userSettings.userId; // Example: input param

    // Request payload: match action input parameters exactly (case-sensitive)
    var data = {
        "MyInputPara": inputPara
    };

    var req = new XMLHttpRequest();
    req.open("POST", serverURL + "/api/data/v9.2/" + actionName, true);
    req.setRequestHeader("Accept", "application/json");
    req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    req.setRequestHeader("OData-MaxVersion", "4.0");
    req.setRequestHeader("OData-Version", "4.0");

    req.onreadystatechange = function () {
        if (req.readyState === 4) {
            req.onreadystatechange = null;
            if (req.status === 200 || this.status===204) {
                alert("Action called successfully")
                result=JSON.parse(this.response)
                alert(result.MyOutputPara)
            } else {
               var error=JSON.parse(this.response).error;
               alert("error in action"+error.message)
            }
        }
    };
    //Execute the request
    req.send(window.JSON.stringify(data));
}
