using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using uShipLocalizationAdminUI.Models.Contracts;

namespace uShipLocalizationAdminUI.Models
{
    public class LocalizationBundle : ILocalizationBundle
    {
        //[Key]
        public int Id { get; set; }
        public string Uri { get; set; }
        //[RelatedTo(RelatedProperty="LocalizationResource")] 
        public virtual ICollection<LocalizationResource> Resources { get; set; }
    }
}