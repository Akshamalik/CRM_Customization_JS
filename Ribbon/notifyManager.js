function notifyManager(primaryControl) {
    let functionName="notifyManager",flowUrl,recordId,contactName,email,payload;
    try {
        flowUrl = "https://prod-00.centralindia.logic.azure.com:443/workflows/32be23b4175a4a4b8868e1bfd0151bb6/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=IqjwE_28FsxMBnMsAoFPH-Wx6-k7sJgMXrF06EdFCgo"

        recordId = primaryControl.data.entity.getId().replace(/[{}]/g, "");
        if(!isValid(recordId)) return;
        contactName = primaryControl.getAttribute("fullname").getValue();
        if(!isValid(contactName)) return;
        email = primaryControl.getAttribute("emailaddress1").getValue();
        if(!isValid(email)) return;
    
        payload = {
            recordId: recordId,
            contactName: contactName,
            email: email
        };
        if(!isValid(payload)) return;
        sendRequest(flowUrl,payload);  
    } catch (error) {
        console.log(`${functionName}`,error.message)
    }
}

function sendRequest(flowUrl,payload){
    let functionName="sendRequest",req;
    try {
        if(!isValid(Xrm) || !isValid(Xrm.Navigation)) return;
        req = new XMLHttpRequest();
        req.open("POST", flowUrl, true);
        req.setRequestHeader("Content-Type", "application/json"); 
        req.onreadystatechange = function () {
            if (req.readyState === 4) {
                if (req.status === 200 || req.status === 202) {
                    Xrm.Navigation.openAlertDialog({ text: "Manager has been notified!" });
                } else {
                    Xrm.Navigation.openErrorDialog({ message: "Failed to notify manager." });
                }
            }
        };
    
        req.send(JSON.stringify(payload));
    } catch (error) {
        console.log(`${functionName}`,error.message)
    }
}

//Generic function to validate attributes
function isValid(attribute) {
    let functionName = "isValid";
    let valid = false;
  
    try {
      if (
        attribute !== null &&
        attribute !== undefined &&
        attribute !== "undefined" &&
        attribute !== "null" &&
        attribute !== ""
      ) {
        valid = true;
      }
    } catch (error) {
      console.error(`${functionName}: Error during validation:`, error.message);
    }
    return valid;
}
  