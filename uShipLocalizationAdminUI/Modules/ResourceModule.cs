using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Nancy;
using uShipLocalizationAdminUI.Models;
using uShipLocalizationAdminUI.Services;
using uShipLocalizationAdminUI.Models.Contracts;


namespace uShipLocalizationAdminUI.Modules
{
    public class ResourceModule : NancyModule
    {
        public ResourceModule() : base("/resources")
        {
            Get["/"] = parameters => 
            {
                var resourceService = new LocalizationResourceService();
                var resources = resourceService.GetItems().Take(10).ToList();
                var json = resources.Select(r => new ResourceJsonViewModel(r));

                return Response.AsJson(json);
            };

            Get["/{key}"] = parameters => 
            {
                var resourceService = new LocalizationResourceService();
                var resource = resourceService.GetItemByKey(parameters.key);
                return "Foo";
            };
        }
    }
}