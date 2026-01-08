function callFlow(executionContext){
    var formContext=executionContext.getFormContext();
    var accountName=formContext.getAttribute("name").getValue();
    var email=formContext.getAttribute("emailaddress1").getValue();

    var params={
        "Name":accountName,
        "Email":email
    }

    var url=""
    var req=new XMLHttpRequest()
    var 
}