# Dynamics 365 / Dataverse JavaScript Customizations

This repository contains JavaScript-based customizations for Microsoft Dynamics 365 / Dataverse, covering form scripting, business logic, UI extensions, and process automation.
It serves as a centralized codebase for client-side customizations used across model-driven apps.

# 🧩 Customization Types Covered
📝 Form Scripting
JavaScript used on entity forms to enhance user experience and enforce business rules.
Includes:
Field validation
Show/hide or enable/disable fields
Dynamic default values
OnLoad / OnSave / OnChange logic
Conditional required fields
Lookup filtering
Notifications and alerts

# 🧠 Business Process Flow (BPF) Customizations

Scripts that interact with Business Process Flows to control stage behavior.
Includes:
Stage change validation
Conditional stage navigation
Required steps enforcement
Programmatic stage movement
BPF event handling (addOnStageChange, addOnStageSelected)

# ⚙️ Actions & Process Automation

JavaScript that invokes Dataverse Actions and Custom APIs.
Includes:
Calling bound and unbound actions
Web API (Xrm.WebApi) integrations
Asynchronous process handling
Error handling and response parsing
Triggering server-side logic from UI events

# 🧭 Ribbon Customization

JavaScript functions used by Ribbon buttons and command bars.
Includes:
Enable/Disable rules
Visibility rules
Custom button click handlers
Context-aware ribbon logic
Role-based UI behavior

#🔧 General CRM / Dataverse Customizations

Reusable utilities and helpers for common CRM tasks.
Includes:
FormContext helpers
User, role, and security checks
Record navigation
Dialogs and confirmations
Date, string, and lookup utilities


# 🚀 Deployment & Usage

Upload JavaScript files as Web Resources in Dataverse
Reference scripts in:
Form event handlers
Business Process Flows
Ribbon commands
Publish customizations
Clear browser cache if needed

# 🧪 Supported APIs

Xrm.Page (legacy support where applicable)
formContext
Xrm.WebApi
Xrm.Navigation
Xrm.Utility
Ribbon Workbench compatible functions

# 🧠 Best Practices Followed

Uses formContext instead of deprecated Xrm.Page
Modular and reusable functions
Defensive null and type checks
Clear naming conventions
Minimal global namespace pollution
Separation of concerns by customization type

# ⚠️ Notes & Considerations

Scripts are intended for model-driven apps
Some logic may be entity-specific
Ensure proper event registration (OnLoad, OnSave, etc.)
Ribbon logic must be deployed via Ribbon Workbench or command designer

# 🔒 Security

No credentials stored in code
All calls respect user security roles
Server-side actions enforce additional validation where required

# 🤝 Contributing

Follow existing folder and naming conventions
Document new functions clearly
Test in a sandbox environment before deployment
Avoid breaking changes to shared utilities

# 📄 License

MIT License

# 👤 Author

Aksha
Dynamics 365 & Power Platform Developer