using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using uShipLocalizationAdminUI.Models.Contracts;
using System.Data.Entity;
using Nancy.Json;

namespace uShipLocalizationAdminUI.Models
{
    public class LocalizationResource : ILocalizationResource
    {
        public LocalizationResource()
        {
            this.Bundles = new HashSet<LocalizationBundle>();
        }

        public string Id { get; set; }
        public string ResourceKey { get; set; }
        public string enUS { get; set; }
        public string enGB { get; set; }
        public string frFR { get; set; }
        public string deDE { get; set; }
        public string nlNL { get; set; }
        public string esES { get; set; }
        public virtual ICollection<LocalizationBundle> Bundles { get; set; }
    }
}