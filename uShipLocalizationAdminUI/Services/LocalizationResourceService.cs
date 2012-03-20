using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;
using uShipLocalizationAdminUI.Data;
using uShipLocalizationAdminUI.Data.Contracts;
using uShipLocalizationAdminUI.Models.Contracts;

namespace uShipLocalizationAdminUI.Services
{
    public class LocalizationResourceService : IRepository<ILocalizationResource,string>
    {
        public LocalizationResourceService() : this(new LocalizationContext()){}

        public LocalizationResourceService(ILocalizationContext db)
        {
            _db = db;
        }

        private ILocalizationContext _db;


        public IEnumerable<ILocalizationResource> GetItems()
        {
            return _db.Resources.OrderBy(x => x.Id);
        }

        public IEnumerable<ILocalizationResource> GetItems(Func<ILocalizationResource, bool> query)
        {
            return _db.Resources.Where(query).OrderBy(x => x.Id);
        }

        public ILocalizationResource GetItemById(string id)
        {
            return _db.Resources.Where(x => x.Id == id).FirstOrDefault();
        }

        public ILocalizationResource GetItemByKey(string key)
        {
            return _db.Resources.Where(x => x.ResourceKey == key).FirstOrDefault();
        }

        public ILocalizationResource AddItem(ILocalizationResource item)
        {
            throw new NotImplementedException();
        }

        public ILocalizationResource UpdateItem(int id, ILocalizationResource item)
        {
            throw new NotImplementedException();
        }

        public void DeleteItem(int id)
        {
            throw new NotImplementedException();
        }
    }
}