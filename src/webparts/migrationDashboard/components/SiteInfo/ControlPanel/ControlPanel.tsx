import React from 'react';
import { SiteItem } from '../../../Interfaces/SiteItem';
import { useConst } from '@uifabric/react-hooks';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import {
    ContextualMenuItemType,
    IContextualMenuProps,
    IContextualMenuItem,
    IContextualMenuItemProps,
} from 'office-ui-fabric-react/lib/ContextualMenu';
import { Icon } from 'office-ui-fabric-react/lib/Icon';


interface ControlPanelProps {
    currentSite: SiteItem;
}

const menuProps = {
    shouldFocusOnMount: false,
    items: [{
        key: 'newItem',
        iconProps: {
            iconName: 'Add',
        },
        text: 'New',
    }]
};

export default class ControlPanel extends React.Component<ControlPanelProps, {}> {

    constructor(props) {
        super(props);
        this.state = {};
    }

    public render() {
        return (
            <DefaultButton text="Settings" menuProps={menuProps}

            />
        );


    }
}