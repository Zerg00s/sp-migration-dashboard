import { sp } from '@pnp/sp';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { SiteItem } from '../Interfaces/SiteItem';
import { Constants } from '../components/Constants/Constants';
import { WebPartContext } from '@microsoft/sp-webpart-base';

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

    public patchCurrentSiteItem(context: WebPartContext, patchData: any) {
        const itemPatchEventName = `${Constants.Events.PatchCurrentItem}${context.webPartTag}`;
        console.log("itemPatchEventName", itemPatchEventName);
        var itemPatchEvent = new CustomEvent(itemPatchEventName, {
            detail: patchData
        });
        console.log(itemPatchEvent);
        window.dispatchEvent(itemPatchEvent);
    }
}

export const DataProvider = new DashboardDataProvider();