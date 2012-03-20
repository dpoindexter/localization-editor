using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using uShipLocalizationAdminUI.Models.Contracts;
using Nancy.Json;

namespace uShipLocalizationAdminUI.Models
{
    public class LocalizationBundle : ILocalizationBundle
    {
        public LocalizationBundle()
        {
            this.Resources = new HashSet<LocalizationResource>();
        }

        public string Id { get; set; }
        public string Name { get; set; }
        public bool Enabled { get; set; }
        public virtual ICollection<LocalizationResource> Resources { get; set; }
    }
}