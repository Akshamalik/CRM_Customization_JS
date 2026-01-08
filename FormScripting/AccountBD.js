// Apply filter when the subgrid loads
function loadMilestonesForAccount(executionContext) {
    const functionName = "loadMilestonesForAccount";
    try {
        if (!isValid(executionContext?.getFormContext())) return;
        
        const formContext = executionContext.getFormContext();
        
        // Wait for subgrid to render
        setTimeout(() => {
            const subgrid = formContext.getControl("MilestoneGrid");
            if (isValid(subgrid)) {
                applyMilestoneFilter(formContext, subgrid);
            } else {
                console.warn(`${functionName}: MilestoneGrid subgrid not found`);
            }
        }, 500);
    } catch (error) {
        console.error(`${functionName} Error: ${error.message}`);
    }
}

// Get milestone IDs and apply simple filter to subgrid
function applyMilestoneFilter(formContext, subgrid) {
    const functionName = "applyMilestoneFilter";
    try {
        if (!isValid(formContext) || !isValid(subgrid)) return;
        
        let accountId = formContext.data.entity.getId();
        if (!isValid(accountId)) return;
        
        accountId = accountId.replace(/[{}]/g, "");
        
        // Use WebAPI to get milestone IDs first (more reliable for complex queries)
        const fetchXml = `<fetch version="1.0" output-format="xml-platform" mapping="logical" distinct="false">
            <entity name="bssi_milestone">
                <attribute name="bssi_milestoneid" />
                <link-entity name="bssi_engagement" from="bssi_engagementid" to="bssi_engagement" link-type="inner">
                    <link-entity name="bssi_bd" from="bssi_bdid" to="bssi_bd" link-type="inner">
                        <filter type="and">
                            <condition attribute="bssi_account" operator="eq" value="{${accountId}}" />
                        </filter>
                    </link-entity>
                </link-entity>
            </entity>
        </fetch>`;
        
        if (!isValid(Xrm?.WebApi)) return;
        
        Xrm.WebApi.retrieveMultipleRecords("bssi_milestone", "?fetchXml=" + encodeURIComponent(fetchXml))
            .then(result => {
                applySubgridFilter(subgrid, result.entities, functionName);
            })
            .catch(error => {
                console.error(`${functionName} WebAPI Error: ${error.message}`);
                // Apply empty filter if query fails
                applySubgridFilter(subgrid, [], functionName);
            });
        
    } catch (error) {
        console.error(`${functionName} Error: ${error.message}`);
    }
}

// Apply optimized filter to subgrid
function applySubgridFilter(subgrid, milestoneRecords, functionName) {
    try {
        if (!isValid(subgrid)) return;
        
        let filterXml;
        
        if (milestoneRecords.length === 0) {
            // No records - show empty grid
            filterXml = `<fetch version="1.0">
                <entity name="bssi_milestone">
                    <filter>
                        <condition attribute="bssi_milestoneid" operator="eq" value="{00000000-0000-0000-0000-000000000000}" />
                    </filter>
                </entity>
            </fetch>`;
            console.log(`${functionName}: No milestones found for this account`);
        } else if (milestoneRecords.length <= 100) {
            // Small set - use OR conditions
            const conditions = milestoneRecords.map(record =>
                `<condition attribute="bssi_milestoneid" operator="eq" value="{${record.bssi_milestoneid}}" />`
            ).join('');

            filterXml = `<fetch version="1.0">
                <entity name="bssi_milestone">
                    <filter type="or">${conditions}</filter>
                </entity>
            </fetch>`;
            console.log(`${functionName}: Filtering ${milestoneRecords.length} milestone(s)`);
        } else {
            // Large set - use IN operator (more efficient)
            const idList = milestoneRecords.map(record => record.bssi_milestoneid).join(',');
            
            filterXml = `<fetch version="1.0">
                <entity name="bssi_milestone">
                    <filter>
                        <condition attribute="bssi_milestoneid" operator="in">
                            <value>${idList}</value>
                        </condition>
                    </filter>
                </entity>
            </fetch>`;
            console.log(`${functionName}: Filtering ${milestoneRecords.length} milestone(s) using IN operator`);
        }
        
        subgrid.setFilterXml(filterXml);
        
        setTimeout(() => {
            subgrid.refresh();
            console.log(`${functionName}: Subgrid refreshed after filter`);
        }, 300);
        
    } catch (error) {
        console.error(`${functionName} Error applying filter: ${error.message}`);
    }
}

// Utility function to validate objects and values
function isValid(value) {
    try {
        return value !== null && value !== undefined && value !== "undefined" && value !== "null" && value !== "";
    } catch (error) {
        console.error("isValid Error: " + error.message);
        return false;
    }
}