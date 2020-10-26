export default class Measures {
    /**
    * Format Megabytes to ###,####.## MB/GB/TB format.
    * Measure is automatically determined by the size of the number provided.
    * @param measureInMegabytes number of megabytes
    * @returns formatted number in MB, GB or TB, depending on the size
    */
    public static formatToDigitalSpace(measureInMegabytes: number): string {
        let finalMeasure: number = measureInMegabytes;
        // TODO: use context.pageContext.cultureInfo.currentUICultureName instead:
        const numberFormat = new Intl.NumberFormat("en-US", {
            maximumFractionDigits: 2
        });

        if (measureInMegabytes < 1000) {
            return numberFormat.format(finalMeasure) + ' MB';
        }

        if (measureInMegabytes > 1000000) {
            finalMeasure = measureInMegabytes / 1000 / 1000;
            return numberFormat.format(finalMeasure) + ' TB';
        }

        finalMeasure = measureInMegabytes / 1000;
        return numberFormat.format(finalMeasure) + ' GB';
    }
}