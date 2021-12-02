sap.ui.define([
    
], function() {
    'use strict';
    return {
        getStatus: function(inp){
            switch (inp) {
                case "All":
                    return "Success";
                    break;
                case "Summer":
                    return "Error";
                    break;
                case "Winter":
                    return "Warning";
                    break;
                default:
                    break;
            }
        }
    };
});