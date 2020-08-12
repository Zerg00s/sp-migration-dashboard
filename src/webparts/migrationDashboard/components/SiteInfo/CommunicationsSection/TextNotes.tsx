import React from 'react';
import { SiteItem } from '../../../Interfaces/SiteItem';
import { RichText } from '@pnp/spfx-controls-react/lib/controls/richText';
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/components/Button';
import styles from '../../MigrationDashboard.module.scss';
import { Icon } from 'office-ui-fabric-react/lib/components/Icon';

interface TextNotesProps {
    currentSite: SiteItem;
}
interface TextNotesState {
    editMode: boolean;
}
export default class TextNotes extends React.Component<TextNotesProps, TextNotesState> {
    constructor(props: TextNotesProps) {
        super(props);

        this.state = {
            editMode: true
        };
    }

    private text: string = this.props.currentSite.PublicNotes;

    private onChange = (text: string): string => {
        this.text = text;
        return text;
    }

    private editMode = () => {
        this.setState({
            editMode: true
        });
    }

    private cancel = () => {
        this.setState({
            editMode: false
        });
    }

    private saveChanges = () => {
        this.setState({
            editMode: false
        });
    }

    public render() {
        return (
            <React.Fragment>
                <div style={{ position: 'relative' }}>
                    <h3>Notes for site owners</h3>
                    <RichText value={this.props.currentSite.PublicNotes}
                        isEditMode={this.state.editMode}
                        styleOptions={{
                            showBold: true,
                            showLink: true,
                            showList: true,
                            showAlign: true,
                            showItalic: true,
                            showUnderline: true
                        }}
                        onChange={(text) => this.onChange(text)}
                    />
                    {!this.state.editMode &&
                        <DefaultButton
                            iconProps={{ iconName: "Edit" }}
                            className={styles.textEditIcon} 
                            onClick={this.editMode}/>
                    }
                </div>
                {this.state.editMode &&
                    <React.Fragment>
                        <PrimaryButton text="Save" className={styles.richTextButton} onClick={this.cancel} />
                        <DefaultButton text="Cancel" className={styles.richTextButton} onClick={this.saveChanges} />
                    </React.Fragment>
                }

            </React.Fragment>
        );
    }
}

