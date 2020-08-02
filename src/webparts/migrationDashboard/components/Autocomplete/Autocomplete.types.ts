import { IRefObject, ISearchBox } from "office-ui-fabric-react";
import { SiteItem } from "../../Interfaces/SiteItem";

export interface IAutocompleteProps {
  items: SiteItem[];
  searchTitle?: string;
  suggestionCallback: (item: SiteItem) => void;
  searchCallback: (item: SiteItem) => void;
  componentRef?: IRefObject<ISearchBox>;
  
}
export interface IAutocompleteState {
  isSuggestionDisabled: boolean;
  searchText: string;
}