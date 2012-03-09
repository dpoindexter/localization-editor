using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Nancy;

namespace uShipLocalizationAdminUI.Modules
{
    public class BundleModule : NancyModule
    {
        public BundleModule() : base("/bundles")
        {
            Get["/"] = parameters =>
            {
                return "Bundle Collection";
            };

            Get["/{id}"] = parameters =>
            {
                return "Bundle " + parameters.id;
            };
        }
    }
}