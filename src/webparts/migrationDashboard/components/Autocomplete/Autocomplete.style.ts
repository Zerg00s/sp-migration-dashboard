import { DefaultColors } from './colors';
import { mergeStyleSets } from '@uifabric/styling';

export const AutocompleteStyles = () => {
  return ({
    marginTop: '10px', marginBottom: '20px'
  });
};
export const SuggestionListStyle = () => {
  return ({ padding: '4px 16px', fontSize: '14px', cursor: 'default' });
};
export const SuggestionListItemStyle = mergeStyleSets({
  root: {
    selectors: {
      '&:hover': {
        backgroundColor: DefaultColors.Item.ListItemHoverBackgroundColor
      }
    }
  }
});
