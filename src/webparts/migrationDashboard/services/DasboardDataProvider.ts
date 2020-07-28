import { sp } from '@pnp/sp';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { SiteItem } from '../Interfaces/SiteItem';


class DashboardDataProvider {
    public async getSites() {
        let siteItems = await sp.web.lists.getByTitle("Sites Report").items.getAll();
        siteItems = siteItems.map((siteItem: SiteItem) => {
            // TODO: ETL 
            return siteItem;
        });
        return siteItems;
    }
}

export const dataProvider = new DashboardDataProvider();