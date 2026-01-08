function updateStatusCase(primaryControl){
    debugger;
    var formContext = primaryControl;
    var guid=formContext.data.entity.getId();
    var executeWorkflowRequest={
        entity:{id:"159E7F25-1089-44DD-B45D-5D979A2A20FB",entityType:"workflow"},
        EntityId:{guid},
        getMetadata:function(){
            return{
                boundParameter:"entity",
                parameterTypes:{
                    "entity":{
                        "typename":"mscrm.workflow",
                        "structuralProperty":5
                    },
                    "EntityId":{
                        "typename":"Edm.Guid",
                        "structuralProperty":1
                    }
                },
                operationType:0,
                operationName:"ExecuteWorkFlow"
            };
        }
    };
    Xrm.WebApi.online.execute(executeWorkflowRequest).then(
        function success(result){
            if(result.ok){
                var results=JSON.parse(result.responseText);
            }
        },
        function(error){
            Xrm.Utility.alertDialog(error.message);
        }
    );
}


