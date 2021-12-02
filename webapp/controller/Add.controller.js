sap.ui.define([
    'tcs/fin/payroll/controller/BaseController',
    'sap/ui/model/json/JSONModel',
    'sap/m/MessageToast',
    'sap/m/MessageBox',
    'sap/ui/core/Fragment'
], function(BaseController, JSONModel, MessageToast, MessageBox, Fragment) {
    'use strict';
    return BaseController.extend("tcs.fin.payroll.controller.Add",{
        onInit: function(){
            this.oLocalData = new JSONModel();
            this.oLocalData.setData({
                "productData": {
                        "PRODUCT_ID": "",
                        "TYPE_CODE": "PR",
                        "CATEGORY": "Notebooks",
                        "NAME": "",
                        "DESCRIPTION": "",
                        "SUPPLIER_ID": "0100000046",
                        "SUPPLIER_NAME": "SAP",
                        "PRICE": "",
                        "CURRENCY_CODE": "EUR",
                        "DIM_UNIT": "CM",
                        "PRODUCT_PIC_URL": "/sap/public/bc/NWDEMO_MODEL/IMAGES/PO-1000.jpg"
                    }
            });
            this.getView().setModel(this.oLocalData, "local");
        },
        mode: "create",
        onEnter: function(oEvent){
            //Step 1: Read the value of Product ID entered by user.
            var value = oEvent.getParameter("value");
            //Step 2: Get Odata model object
            var oDataModel = this.getView().getModel();
            //Step 3: Call the Read function of OData to get single record
            var that = this;
            this.getView().setBusy(true);
            oDataModel.read("/ProductSet('" + value + "')",{
                success: function(data){
                    //Step 4: success Callback: set data to local model.
                    that.oLocalData.setProperty("/productData", data);
                    that.getView().setBusy(false);
                    that.mode = "update";
                    that.getView().byId("idSave").setText("Update");
                },
                error: function(oError){
                    //Step 5: error Callback: handle error.
                    MessageBox.error(JSON.parse(oError.responseText).error.innererror.errordetails[0].message);
                    that.getView().setBusy(false);
                    that.mode = "create";
                    that.getView().byId("idSave").setText("Save");
                }
            });
        },
        oField:null,
        onConfirmPopup: function(oEvent){
            var sId = oEvent.getSource().getId();
            //Step 1:Get the selected item by user 
            var oSelectedItem = oEvent.getParameter("selectedItem");
            //Step 2: Get the value of selected data
            var sLabel = oSelectedItem.getLabel();
            //Step 3: Set the value in the same fields INSIDE the table where F4 was pressed
            this.oField.setValue(sLabel);
            this.getView().byId("idSupplierName").setText(oSelectedItem.getValue());
        },
        supplierPopup:null,
        onSupplierF4: function(oEvent){
            this.oField = oEvent.getSource();
            var sId = oEvent.getSource().getId();
            var that = this;
            // just like we check lo_alv IS NOT BOUND
            if(this.supplierPopup === null){
                Fragment
                .load({
                    id: "supplier",
                    name: "tcs.fin.payroll.fragments.popup",
                    controller: this
                })
                .then(function(oDialog){
                    //in the callback function, we will not be getting access to THIS pointer 
                    //As Controller object, we need a local variable that where we assign this
                    // we can have the access of local variable inside the call back
                    
                    that.supplierPopup = oDialog;
                    //Use the remote control of the popup to set the data and title
                    that.supplierPopup.setTitle("Select Supplier");
                    //allow access to model by view - immune system allowing parasite to access 
                    that.getView().addDependent(that.supplierPopup);
                    //MultiSelect
                    that.supplierPopup.setMultiSelect(false);
                    //Syntax no.4 which we learnt in past for aggregation binding
                    that.supplierPopup.bindAggregation("items",{
                        path: '/SupplierSet',
                        template: new sap.m.DisplayListItem({
                            label: "{BP_ID}",
                            value: "{COMPANY_NAME}"
                        })
                    })
                    that.supplierPopup.open();
                });
            }else{
                that.supplierPopup.open();
            }
        },
        onClear: function(){
            this.oLocalData.setProperty("/productData",{
                                    "PRODUCT_ID": "",
                                    "TYPE_CODE": "PR",
                                    "CATEGORY": "Notebooks",
                                    "NAME": "",
                                    "DESCRIPTION": "",
                                    "SUPPLIER_ID": "0100000046",
                                    "SUPPLIER_NAME": "SAP",
                                    "PRICE": "",
                                    "CURRENCY_CODE": "EUR",
                                    "DIM_UNIT": "CM",
                                    "PRODUCT_PIC_URL": "/sap/public/bc/NWDEMO_MODEL/IMAGES/PO-1000.jpg"
            });
            this.getView().byId("idSave").setText("Create");
            this.mode = "create";
            this.getView().byId("idSupplierName").setText("");
        },
        onDelete: function(oEvent){
            MessageBox.confirm("Do you really want to delete this item?",{
                onClose: this._deleteProduct.bind(this)
            });
        },
        onMostExpensive: function(){
            var oDataModel = this.getView().getModel();
            var that = this;
            this.getView().setBusy(true);
            oDataModel.callFunction("/GetMostExpensiveProduct",{
                urlParameters:{
                    "I_CATEGORY": "Notebooks"
                },
                success: function(data){
                    that.oLocalData.setProperty("/productData", data);
                    that.getView().setBusy(false);
                    that.mode = "update";
                    that.getView().byId("idSave").setText("Update");
                },
                error: function(){

                }
            });
        },
        _deleteProduct: function(status){
            if(status === "OK"){
                var productId = this.getView().byId("PID").getValue();
                //Step 2: Get the oData model object(default)
                var oDataModel = this.getView().getModel();
                var that = this;
                oDataModel.remove("/ProductSet('"+ productId +"')",{
                    success: function(){
                        MessageToast.show("Product deleted successfully!");
                        that.onClear();
                    },
                    error: function(oError){
                        MessageBox.error(JSON.parse(oError.responseText).error.innererror.errordetails[0].message);
                        that.onClear();
                    }
                });
            }
        },
        onSave: function(){
            //Step 1: Provide payload to send
            var payload = this.oLocalData.getProperty("/productData");
            //Step 2: Get the oData model object(default)
            var oDataModel = this.getView().getModel();
            //Step 3: Fire a POST Request - Create 
            if(this.mode === "update"){
                oDataModel.update("/ProductSet('" + payload.PRODUCT_ID + "')", payload,{
                    success: function(){
                        MessageToast.show("Update was successfull!");
                    },
                    error: function(oError){
                        MessageBox.error(JSON.parse(oError.responseText).error.innererror.errordetails[0].message);
                    }
                });
            }else{
                oDataModel.create("/ProductSet", payload,{
                    success: function(){
                        MessageToast.show("Product created successfully!");
                    },
                    error: function(oError){
                        MessageBox.error(JSON.parse(oError.responseText).error.innererror.errordetails[0].message);
                    }
                });
            }
        }
    });
});