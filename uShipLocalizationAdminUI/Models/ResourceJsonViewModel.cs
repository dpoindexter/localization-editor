using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using uShipLocalizationAdminUI.Models.Contracts;

namespace uShipLocalizationAdminUI.Models
{
    public class ResourceJsonViewModel
    {
        public ResourceJsonViewModel(ILocalizationResource resource)
        {
            Id = resource.Id;
            ResourceKey = resource.ResourceKey;
            @en_US = resource.enUS;
            @en_GB = resource.enGB;
            @fr_FR = resource.frFR;
            @de_DE = resource.deDE;
            @nl_NL = resource.nlNL;
            @es_ES = resource.esES;
            Bundles = resource.Bundles.Select(b => b.Id);
        }

        public string Id { get; set; }
        public string ResourceKey { get; set; }
        public string @en_US { get; set; }
        public string @en_GB { get; set; }
        public string @fr_FR { get; set; }
        public string @de_DE { get; set; }
        public string @nl_NL { get; set; }
        public string @es_ES { get; set; }
        public IEnumerable<string> Bundles { get; set; }
    }
}