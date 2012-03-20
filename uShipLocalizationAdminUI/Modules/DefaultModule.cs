using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Nancy;

namespace uShipLocalizationAdminUI
{
    public class DefaultModule : NancyModule
    {
        public DefaultModule()
        {
            Get["/"] = parameters => View["index.cshtml"];
        }
    }
}