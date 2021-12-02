sap.ui.define([
    'tcs/fin/payroll/controller/BaseController'
], function(BaseController) {
    'use strict';
    return BaseController.extend("tcs.fin.payroll.controller.Supplier",{
        onInit: function(){
            //Get the router object
            this.oRouter = this.getOwnerComponent().getRouter();
            // Use the router object to tell router, I want to call a function 
            //whenever route changes, route can change because
            //1. When I click an item on left
            //2. When user press browser navigation btns
            //3. User can manually change route
            // Hey Router, whenever route change, call a method hercules.
            this.oRouter.getRoute("supplier").attachMatched(this.hercules, this);
        },
        hercules: function(oEvent){
            // Now the route is changed
            //Step 1: What is the fruitId selected by user?
            var sIndex = oEvent.getParameter("arguments").supplierId;
            //Step 2: Construct the path for element binding.
            var sPath = '/suppliers/' + sIndex;
            //Step 3: Perform the element binding with current view
            this.getView().bindElement(sPath); 
        }
    });
});