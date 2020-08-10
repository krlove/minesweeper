export default class Palette {
    private colors = new Set([
        '#FFFFFF',
        '#DFE4DD',
        '#F0E7D8',
        '#D8F3FD',
        '#CBF5F6',
    ]);
    private assigned = new Set<string>();

    getRandomColorHEX(): string {
        if (this.assigned.size === this.colors.size) {
            throw new Error('Out of colors');
        }

        const available = [...this.colors].filter(color => !this.assigned.has(color));
        const index = Math.floor(Math.random() * available.length);
        const color = available[index];
        this.assigned.add(color);

        return color;
    }
}
