using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Nancy;
using uShipLocalizationAdminUI.Models;

namespace uShipLocalizationAdminUI.Modules
{
    public class ResourceModule : NancyModule
    {
        public ResourceModule() : base("/resources")
        {
            Get["/"] = parameters => 
            {
                return Response.AsJson(new LocalizationResource
                {
                    Id = 1,
                    ResourceName = "HelloWorld",
                    en = "Hello",
                    es = "Hola",
                    de = "Gutentag",
                    fr = "Oui",
                    Bundles = new List<LocalizationBundle>()
                });
            };

            Get["/{id}"] = parameters => 
            { 
                return "Resource " + parameters.id; 
            };
        }
    }
}