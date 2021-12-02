sap.ui.define([
    'sap/ui/core/UIComponent'
], function(UIComponent) {
    'use strict';
    return UIComponent.extend("tcs.fin.payroll.Component",{
        metadata: {
            manifest: "json"
        },
        init: function(){
            //create the base class object
            sap.ui.core.UIComponent.prototype.init.apply(this);
            //Step 1: Get the router object
            var oRouter = this.getRouter();
            //Step 2: Initialize
            oRouter.initialize();
        },
        // createContent: function(){
        //     //Step 1: Create App View Object
        //     var oView = new sap.ui.view({
        //         id: "idAppView",
        //         viewName: "tcs.fin.payroll.view.App",
        //         type: "XML"
        //     });

        //     //Step 2: Get the app container control object from App view
        //     var oAppCon = oView.byId("AppCon");

        //     //Step 3: Add our view objects inside app container control
        //     var oView2 = new sap.ui.view({
        //         id: "idView2",
        //         viewName: "tcs.fin.payroll.view.View2",
        //         type: sap.ui.core.mvc.ViewType.XML
        //     });

        //     var oView1 = new sap.ui.view({
        //         id: "idView1",
        //         viewName: "tcs.fin.payroll.view.View1",
        //         type: sap.ui.core.mvc.ViewType.XML
        //     });

        //     // oAppCon.addPage(oView1).addPage(oView2);
        //     oAppCon.addMasterPage(oView1).addDetailPage(oView2);

        //     return oView;
        // },
        // destroy: function(){}
    });
});