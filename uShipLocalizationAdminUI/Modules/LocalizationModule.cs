using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Nancy;

namespace uShipLocalizationAdminUI
{
    public class LocalizationModule : NancyModule
    {
        public LocalizationModule()
        {
            Get["/"] = parameters => "UI";
        }
    }
}