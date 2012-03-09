using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Nancy;

namespace uShipLocalizationAdminUI.Modules
{
    public class LocalizationBundleModule : NancyModule
    {
        public LocalizationBundleModule() : base("/bundles")
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