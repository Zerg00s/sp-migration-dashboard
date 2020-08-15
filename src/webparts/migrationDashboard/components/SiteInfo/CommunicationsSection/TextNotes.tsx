import React from 'react';
import { SiteItem } from '../../../Interfaces/SiteItem';
import { RichText } from '@pnp/spfx-controls-react/lib/controls/richText';
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/components/Button';
import styles from '../../MigrationDashboard.module.scss';
import { Constants } from '../../Constants/Constants';
import { WebPartContext } from '@microsoft/sp-webpart-base';

interface TextNotesProps {
    currentSite: SiteItem;
    context: WebPartContext;
    fieldName: string;
    placeholder: string;
    title: string;
}
interface TextNotesState {
    editMode: boolean;

}
export default class TextNotes extends React.Component<TextNotesProps, TextNotesState> {
    public richText: RichText;
    private text: string = this.props.currentSite.PublicNotes;
    private preEditText: string = this.props.currentSite.PublicNotes;

    constructor(props: TextNotesProps) {
        super(props);

        this.state = {
            editMode: false
        };
    }

    private onChange = (text: string): string => {
        this.text = text;
        return text;
    }

    private editMode = () => {
        this.setState({
            editMode: true
        });
        this.text = this.richText.state.text;
        this.preEditText = this.richText.state.text;
    }

    private cancel = () => {
        this.richText.setState(
            {
                text: this.preEditText
            }
        );

        this.setState({
            editMode: false
        });
    }

    private saveChanges = () => {
        var itemPatchEvent = new CustomEvent(`${Constants.Events.PatchCurrentItem}${this.props.context.webPartTag}`, {
            detail: {
                [this.props.fieldName]: this.text
            }
        });
        window.dispatchEvent(itemPatchEvent);

        this.setState({
            editMode: false
        });

    }

    public render() {
        return (
            <React.Fragment>
                <div style={{ position: 'relative' }}>
                    <h3>{this.props.title}
                    {!this.state.editMode &&
                            <DefaultButton
                                iconProps={{ iconName: "Edit" }}
                                className={styles.textEditIcon}
                                onClick={this.editMode} />
                        }
                    </h3>
                    <RichText value={this.props.currentSite[this.props.fieldName]}
                        isEditMode={this.state.editMode}
                        placeholder={this.props.placeholder}
                        styleOptions={{
                            showBold: true,
                            showLink: true,
                            showList: true,
                            showAlign: true,
                            showItalic: true,
                            showUnderline: true,
                            showStyles: true,
                            showMore: true
                        }}
                        ref={(richText) => this.richText = richText}
                        onChange={(text) => this.onChange(text)}
                    />

                </div>
                {this.state.editMode &&
                    <React.Fragment>
                        <PrimaryButton text="Save" className={styles.richTextButton} onClick={this.saveChanges} />
                        <DefaultButton text="Cancel" className={styles.richTextButton} onClick={this.cancel} />
                    </React.Fragment>
                }

            </React.Fragment>
        );
    }
}

