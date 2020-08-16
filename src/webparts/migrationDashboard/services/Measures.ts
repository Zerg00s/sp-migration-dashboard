export default class Measures {
    /**
    * Formatt Megabytes to ###,####.## MB/GB/TB format.
    * Measure is automatically determined by the size of the number provided.
    * @param measureInMegabites number of megabytes
    * @returns formatted number in MB, GB or TB, depending on the size
    */
    public static formatToDigitalSpace(measureInMegabites: number): string {
        let finalMeasure: number = measureInMegabites;
        // TODO: use context.pageContext.cultureInfo.currentUICultureName instead:
        const numberFormat = new Intl.NumberFormat("en-US", {
            maximumFractionDigits: 2
        });

        if (measureInMegabites < 1000) {
            return numberFormat.format(finalMeasure) + ' MB';
        }

        if (measureInMegabites > 1000000) {
            finalMeasure = measureInMegabites / 1000 / 1000;
            return numberFormat.format(finalMeasure) + ' TB';
        }

        finalMeasure = measureInMegabites / 1000;
        return numberFormat.format(finalMeasure) + ' GB';
    }
}