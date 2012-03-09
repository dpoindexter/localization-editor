using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Nancy;

namespace uShipLocalizationAdminUI.Modules
{
    public class LocalizationResourceModule : NancyModule
    {
        public LocalizationResourceModule() : base("/resources")
        {
            Get["/"] = parameters => 
            {
                return "Resource Collection";
            };

            Get["/{id}"] = parameters => 
            { 
                return "Resource " + parameters.id; 
            };
        }
    }
}