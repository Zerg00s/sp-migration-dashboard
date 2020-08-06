import { sp } from '@pnp/sp';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { SiteItem } from '../Interfaces/SiteItem';
import { Constants } from '../components/Constants/Constants';

class DashboardDataProvider {
    public async getSites() {
        let siteItems = await sp.web.lists.getByTitle(Constants.Lists.SiteReports).items.getAll();
        siteItems = siteItems.map((siteItem: SiteItem) => {
            // TODO: ETL 
            return siteItem;
        });
        return siteItems;
    }


    public async getSiteById(siteID: any) {
        let siteItem = await sp.web.lists.getByTitle(Constants.Lists.SiteReports).items.getById(siteID).get();
        return siteItem;
    }

}

export const DataProvider = new DashboardDataProvider();