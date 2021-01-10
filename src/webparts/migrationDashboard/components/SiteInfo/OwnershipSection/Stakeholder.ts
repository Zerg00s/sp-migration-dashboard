export default interface Stakeholder {
    email: string;
    name: string;
}

function convertStringToStakeholder(stakeholderAsString: string) {
    let emailRegex = /(.*)<(.*)>/;
    const match = stakeholderAsString.match(emailRegex);
    let stakeholder: Stakeholder = { email: "", name: "" };

    if (!match) return stakeholder;

    stakeholder.name = match[1].trim();
    stakeholder.email = match[2].trim();
    return stakeholder;
}

export function convertToStakeholders(stakeholdersString: string): Stakeholder[] {
    stakeholdersString = stakeholdersString.trim().replace(/^\;+|\;+$/g, '');
    let uniqueStakeholderStrings = stakeholdersString.split(";").filter((item, pos, self) => {
        return self.indexOf(item) == pos;
    });

    let stakeholders = uniqueStakeholderStrings
        .filter(stakeholder => stakeholder.length != 0)
        .map(convertStringToStakeholder);

    return stakeholders;
}
export function convertStakeholdersToString(stakeholders: Stakeholder[]): string {
    if (!stakeholders || stakeholders.length === 0) {
        return "";
    }
    return stakeholders.map(stakeholder => `${stakeholder.name} <${stakeholder.email}>`).join(";");
}