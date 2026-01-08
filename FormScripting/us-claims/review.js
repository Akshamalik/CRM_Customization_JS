function lawFirmBlocker(executionContext) {
    var formContext = executionContext.getFormContext();
    var alreadyBlockedFlag = false;

    // AK UC25-769
    if (formContext.getAttribute("statecode").getValue() === 1 || formContext.getAttribute("statecode").getValue() === 2) {
        return alreadyBlockedFlag;
    }

    if (formContext.getAttribute("drb_existingattorney") && formContext.getAttribute("drb_existingattorney").getValue()) {
        var attorneyId = formContext.getAttribute("drb_existingattorney").getValue()[0].id.slice(1, -1);

        // AK UC25-811
        var tier1max = null;
        var tier2max = null;
        var partyexposuremax = null;
        var req = new XMLHttpRequest();
        req.open("GET", Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v9.2/usc_programtypes?$select=usc_programtypeid,usc_partyexposuremax,usc_tier1max,usc_tier2max", false);
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Prefer", "odata.include-annotations=*");
        req.onreadystatechange = function () {
            if (this.readyState === 4) {
                req.onreadystatechange = null;
                if (this.status === 200) {
                    var results = JSON.parse(this.response);
                    console.log(results);
                    for (var i = 0; i < results.value.length; i++) {
                        var result = results.value[i];
                        var usc_programtypeid = result["usc_programtypeid"];
                        partyexposuremax = result["usc_partyexposuremax"];
                        tier1max = result["usc_tier1max"];
                        tier2max = result["usc_tier2max"];
                    }
                } else {
                    console.log(this.responseText);
                }
            }
        };
        req.send();

        // Get all teir 1 and teir 2 law firms from ProgramType
        var tier1Accounts = [];
        var tier2Accounts = [];
        var req = new XMLHttpRequest();
        req.open("GET", Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v9.2/usc_programtypes?$expand=usc_programtype_Tier1Account($select=accountid),usc_programtype_Tier2Account($select=accountid)", false);
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Prefer", "odata.include-annotations=*");
        req.onreadystatechange = function () {
            if (this.readyState === 4) {
                req.onreadystatechange = null;
                if (this.status === 200) {
                    var results = JSON.parse(this.response);
                    console.log(results);
                    for (var i = 0; i < results.value.length; i++) {
                        var result = results.value[i];
                        // Columns
                        var usc_programtypeid = result["usc_programtypeid"]; // Guid

                        // Many To Many Relationships
                        for (var j = 0; j < result.usc_programtype_Tier1Account.length; j++) {
                            tier1Accounts.push(result.usc_programtype_Tier1Account[j]["accountid"]); // Guid
                        }
                        for (var j = 0; j < result.usc_programtype_Tier2Account.length; j++) {
                            tier2Accounts.push(result.usc_programtype_Tier2Account[j]["accountid"]); // Guid
                        }
                    }
                } else {
                    console.log(this.responseText);
                }
            }
        };
        req.send();
        if (tier1Accounts.length === 0 && tier2Accounts.length === 0) {
            console.log("Both Tier 1 and Tier 2 account lists are empty.");
            // add return other logic here
        }

        // MA UC25-166

        var lawFirmID = null;
        var req = new XMLHttpRequest();
        req.open("GET", Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v9.2/contacts(" + attorneyId + ")?$select=_parentcustomerid_value", false);
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Prefer", "odata.include-annotations=*");
        req.onreadystatechange = function () {
            if (this.readyState === 4) {
                req.onreadystatechange = null;
                if (this.status === 200) {
                    var result = JSON.parse(this.response);
                    console.log(result);
                    // Columns
                    var contactid = result["contactid"]; // Guid
                    lawFirmID = result["_parentcustomerid_value"]; // Customer
                    var parentcustomerid_formatted = result["_parentcustomerid_value@OData.Community.Display.V1.FormattedValue"];
                    var parentcustomerid_lookuplogicalname = result["_parentcustomerid_value@Microsoft.Dynamics.CRM.lookuplogicalname"];
                } else {
                    console.log(this.responseText);
                }
            }
        };
        req.send();

        // AK UC25-811
        var maxLawFirmExposure = null;
        if (tier1Accounts.includes(lawFirmID)) {
            console.log("Law Firm ID is in Tier 1 list");
            maxLawFirmExposure = tier1max;
        } else if (tier2Accounts.includes(lawFirmID)) {
            console.log("Law Firm ID is in Tier 2 list");
            maxLawFirmExposure = tier2max;
        } else {
            console.log("Law Firm ID is not in Tier 1 or Tier 2 lists");
        }

        if (lawFirmID != null && maxLawFirmExposure != null) {
            var MVAExposure = 0;
            var MVAreq = new XMLHttpRequest();
            MVAreq.open("GET", Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v9.2/accounts(" + lawFirmID + ")?$select=usc_mva01exposure", false);
            MVAreq.setRequestHeader("OData-MaxVersion", "4.0");
            MVAreq.setRequestHeader("OData-Version", "4.0");
            MVAreq.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            MVAreq.setRequestHeader("Accept", "application/json");
            MVAreq.setRequestHeader("Prefer", "odata.include-annotations=*");
            MVAreq.onreadystatechange = function () {
                if (this.readyState === 4) {
                    MVAreq.onreadystatechange = null;
                    if (this.status === 200) {
                        var result = JSON.parse(this.response);
                        console.log(result);
                        // Columns
                        var accountid = result["accountid"]; // Guid
                        MVAExposure = result["usc_mva01exposure"]; // Currency

                        // AK UC25-783
                        // AK UC25-811
                        // if (MVAExposure > 150000) {
                        if (MVAExposure > maxLawFirmExposure) {
                            alreadyBlockedFlag = true;
                            var alertStrings = { confirmButtonLabel: "OK", text: "MVA01 Firm Exposure exceeds $" + maxLawFirmExposure + ". This lead cannot be included in the MVA01 Program", title: " MVA Exposure Blocker" };
                            var alertOptions = { height: 120, width: 260 };
                            Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
                                function (success) {
                                    console.log("Exposure Exceeds");
                                    formContext.getAttribute("usc_programtypelookup").setValue(null);
                                    formContext.ui.clearFormNotification('mvaAlert');
                                },
                                function (error) {
                                    console.log(error.message);
                                }
                            );
                        }
                    } else {
                        console.log(this.responseText);
                    }
                }
            };
            MVAreq.send();
        }

        if (!alreadyBlockedFlag) {

            // Ak UC25-811
            // Retrieve Law Firms related to MVA01 Program Type
            // var lawFirmReq = new XMLHttpRequest();
            // lawFirmReq.open("GET", Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v9.2/usc_programtypes?$select=usc_programtypeid&$expand=usc_usc_programtype_account($select=accountid)&$filter=usc_programtypeid eq " + formContext.getAttribute("usc_programtypelookup").getValue()[0].id.slice(1, -1), false);
            // lawFirmReq.setRequestHeader("OData-MaxVersion", "4.0");
            // lawFirmReq.setRequestHeader("OData-Version", "4.0");
            // lawFirmReq.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            // lawFirmReq.setRequestHeader("Accept", "application/json");
            // lawFirmReq.setRequestHeader("Prefer", "odata.include-annotations=*");
            // lawFirmReq.onreadystatechange = function () {
            //     if (this.readyState === 4) {
            //         lawFirmReq.onreadystatechange = null;
            //         if (this.status === 200) {
            //             var results = JSON.parse(this.response);
            //             console.log(results);
            //             var lawFirms = "";
            //             for (var i = 0; i < results.value.length; i++) {
            //                 var result = results.value[i];
            //                 // Columns
            //                 var usc_programtypeid = result["usc_programtypeid"]; // Guid

            //                 // Many To Many Relationships
            //                 for (var j = 0; j < result.usc_usc_programtype_account.length; j++) {
            //                     var usc_usc_programtype_account_accountid = result.usc_usc_programtype_account[j]["accountid"]; // Guid
            //                     lawFirms += "<value>{" + usc_usc_programtype_account_accountid + "}</value>";
            //                 }

            var lawFirms = "";

            for (var i = 0; i < tier1Accounts.length; i++) {
                lawFirms += "<value>{" + tier1Accounts[i] + "}</value>";
            }
            for (var i = 0; i < tier2Accounts.length; i++) {
                lawFirms += "<value>{" + tier2Accounts[i] + "}</value>";
            }

            if (lawFirms && lawFirms != "") {
                // Retrieve Related Attorney
                var linkedAttorneyFetch = `<fetch version="1.0" output-format="xml-platform" mapping="logical" distinct="true" count='1'>
									<entity name="account">
									<attribute name="name" />
									<attribute name="primarycontactid" />
									<attribute name="telephone1" />
									<attribute name="accountid" />
									<order attribute="name" descending="false" />
									<filter type="and">
										<condition attribute="accountid" operator="in">
										`+ lawFirms + `
										</condition>
									</filter>
									<link-entity name="contact" from="parentcustomerid" to="accountid" link-type="inner" alias="ag">
										<filter type="and">
										<condition attribute="contactid" operator="eq" value="{`+ attorneyId + `}" />
										</filter>
									</link-entity>
									</entity>
								</fetch>`;

                var req = new XMLHttpRequest();
                req.open("GET", Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v9.1/accounts?fetchXml=" + encodeURI(linkedAttorneyFetch), false);
                req.setRequestHeader("OData-MaxVersion", "4.0");
                req.setRequestHeader("OData-Version", "4.0");
                req.setRequestHeader("Accept", "application/json");
                req.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
                req.onreadystatechange = function () {
                    if (this.readyState === 4) {
                        req.onreadystatechange = null;
                        if (this.status === 200) {
                            var results = JSON.parse(this.response);
                            if (results.value.length == 0) {
                                // No Law Firms found, show Law Firm Blocker for MVA01
                                alreadyBlockedFlag = true;
                                var alertStrings = { confirmButtonLabel: "OK", text: "Cannot be qualified under MVA01 because the firm is not a part of the program.", title: "Law Firm Blocker" };
                                var alertOptions = { height: 120, width: 260 };
                                Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
                                    function (success) {
                                        console.log("Exposure Exceeds");
                                        formContext.getAttribute("usc_programtypelookup").setValue(null);
                                        formContext.ui.clearFormNotification('mvaAlert');
                                    },
                                    function (error) {
                                        console.log(error.message);
                                    }
                                );
                            }
                        } else {
                            Xrm.Navigation.openAlertDialog(this.responseText);
                        }
                    }
                };
                req.send();
            }
        }
    }
    return alreadyBlockedFlag;
}