export default class Measures {
    /**
    * Format date to Tue, October 27, 2020, 10 AM format
    * @param date date as a string
    * @returns formatted date as Tue, October 27, 2020, 10 AM format
    */
    public static getUserFriendlyDate(date: string): string {
        const parsedDate = new Date(date);
        // TODO: use context.pageContext.cultureInfo.currentUICultureName instead:
        const dateAsString = parsedDate.toLocaleDateString('en-US', {
            weekday: 'short', // "Sat"
            month: 'long', // "June"
            day: '2-digit', // "01"
            year: 'numeric', // "2019",
            hour: '2-digit' //  8 AM
        });

        return dateAsString;
    }
}