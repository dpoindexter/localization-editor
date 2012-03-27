using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Nancy;
using uShipLocalizationAdminUI.Models;
using uShipLocalizationAdminUI.Contracts.Models;
using uShipLocalizationAdminUI.Services;

namespace uShipLocalizationAdminUI
{
    public class DefaultModule : NancyModule
    {
        public DefaultModule()
        {
            Get["/"] = parameters =>
            {
                var model = new DefaultViewModel
                {
                    columns = ColumnCollection.GetColumns<IResourceJsonViewModel>(),
                    resources = new LocalizationResourceService().GetItems().Take(30).ToList().Select(r => new ResourceJsonViewModel(r))

                };
                return View["index.cshtml", model];
            };
        }
    }
}