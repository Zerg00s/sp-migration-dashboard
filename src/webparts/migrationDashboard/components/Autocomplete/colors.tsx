import { DefaultPalette, } from 'office-ui-fabric-react/lib/Styling';
import  {DarkPalette}  from './palette';
export const DefaultColors = {
        Application: {
            Primary: '#0078d7',
            Secondary: '#e5e5e5',
            LightBackground: '#ffffff',
            NeutralBackground: '#e5e5e5'
        },
        VisualIndicators: {
            GrayIndicator: '#7a7574', 
            GreenIndicator: '#498205',
            YellowIndicator: '#fce100',
            RedIndicator: '#d1343b',
            BlueIndicator: '#0078d7'
        },
        Text: {
            Header: DefaultPalette.neutralPrimary, 
            Primary: DefaultPalette.neutralPrimary, 
            Secondary: DefaultPalette.neutralSecondary, 
            HeroAccent: '#0078D7',
            Error: DefaultPalette.redDark
        },
        Link: {
            PrimaryLink: DefaultPalette.themePrimary, 
            HeroLink: DefaultPalette.themeDark, 
        },
        List: {
            HeaderText: DefaultPalette.neutralSecondary,
            RowText: DefaultPalette.neutralPrimary,
        },
        Item: {
            ListItemHoverBackgroundColor: DefaultPalette.neutralLighterAlt,
            ItemIndicator: '#0078d7'
        },
        Icon: {
            SecondaryIcon: DefaultPalette.neutralSecondary,
            PrimaryIcon: DefaultPalette.neutralPrimary
        }
    };

export const DarkColors = {
      Application: {
        Primary: '#0078d7',
        Secondary: '#e5e5e5',
        LightBackground: '#ffffff',
        NeutralBackground: '#e5e5e5'
      },
    VisualIndicators: {
        GrayIndicator: '#7a7574', 
        GreenIndicator: '#498205',
        YellowIndicator: '#fce100',
        RedIndicator: '#d1343b',
        BlueIndicator: '#0078d7'
      },
    Text: {
        Header: DarkPalette.neutralPrimary, 
        Primary: DarkPalette.neutralPrimary, 
        Secondary: DarkPalette.neutralSecondary, 
        HeroAccent: '#0078D7',
        Error: DarkPalette.redDark
      },
    Link: {
        PrimaryLink: DarkPalette.themePrimary, 
        HeroLink: DarkPalette.themeDark, 
      },
    List: {
        HeaderText: DarkPalette.neutralSecondary,
        RowText: DarkPalette.neutralPrimary,
      },
    Item: {
        ListItemHoverBackgroundColor: DarkPalette.neutralLighterAlt,
        ItemIndicator: '#0078d7'
      },
    Icon: {
        SecondaryIcon: DarkPalette.neutralSecondary,
        PrimaryIcon: DarkPalette.neutralPrimary
      }
  };

 
  