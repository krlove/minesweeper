export function sleep(milliseconds: number): Promise<number> {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}
