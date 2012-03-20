using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using uShipLocalizationAdminUI.Models.Contracts;
using uShipLocalizationAdminUI.Data.Contracts;
using uShipLocalizationAdminUI.Data;

namespace uShipLocalizationAdminUI.Services
{
    public class LocalizationBundleService : IRepository<ILocalizationBundle,string>
    {
        public LocalizationBundleService() : this(new LocalizationContext()) { }

        public LocalizationBundleService(ILocalizationContext db)
        {
            _db = db;
        }

        private ILocalizationContext _db;

        public IEnumerable<ILocalizationBundle> GetItems()
        {
            throw new NotImplementedException();
        }

        public IEnumerable<ILocalizationBundle> GetItems(Func<ILocalizationBundle, bool> query)
        {
            throw new NotImplementedException();
        }

        public ILocalizationBundle GetItemById(string id)
        {
            throw new NotImplementedException();
        }

        public ILocalizationBundle AddItem(ILocalizationBundle item)
        {
            throw new NotImplementedException();
        }

        public ILocalizationBundle UpdateItem(int id, ILocalizationBundle item)
        {
            throw new NotImplementedException();
        }

        public void DeleteItem(int id)
        {
            throw new NotImplementedException();
        }
    }
}