using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using uShipLocalizationAdminUI.Models.Contracts;
using uShipLocalizationAdminUI.Data.Contracts;

namespace uShipLocalizationAdminUI.Data.Contracts
{
    interface IRepository<TItem,TIndex> where TItem : IIndexed<TIndex>
    {
        IEnumerable<TItem> GetItems();
        IEnumerable<TItem> GetItems(Func<TItem, bool> query);
        TItem GetItemById(TIndex id);
        TItem AddItem(TItem item);
        TItem UpdateItem(int id, TItem item);
        void DeleteItem(int id);
    }
}
