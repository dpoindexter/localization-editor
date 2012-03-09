using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using uShipLocalizationAdminUI.Models.Contracts;

namespace uShipLocalizationAdminUI.Models
{
    public class LocalizationResource : ILocalizationResource
    {
        //[Key]
        public int Id { get; set; }
        public string ResourceName { get; set; }
        public string en { get; set; }
        public string fr { get; set; }
        public string de { get; set; }
        public string es { get; set; }
        //[RelatedTo(RelatedProperty = "LocalizationBundle")] 
        public virtual ICollection<LocalizationBundle> Bundles { get; set; }
    }
}