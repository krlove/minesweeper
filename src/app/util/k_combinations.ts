function kCombinations(set: any[], k: number): number[][] {
    let i, j, combs, head, tailcombs;

    if (k > set.length || k <= 0) {
        return [];
    }

    if (k == set.length) {
        return [set];
    }

    if (k == 1) {
        combs = [];
        for (i = 0; i < set.length; i++) {
            combs.push([set[i]]);
        }
        return combs;
    }

    combs = [];
    for (i = 0; i < set.length - k + 1; i++) {
        head = set.slice(i, i + 1);
        tailcombs = kCombinations(set.slice(i + 1) as [], k - 1);
        for (j = 0; j < tailcombs.length; j++) {
            combs.push(head.concat(tailcombs[j]));
        }
    }

    return combs;
}

export function combinations(set: any[], k: number): boolean[][] {
    const length = set.length;
    const kCombs = kCombinations(set, k);
    const combs = [];

    for (const kComb of kCombs) {
        const comb = [];
        for (let i = 0; i < length; i++) {
            comb.push(kComb.indexOf(set[i]) > -1);
        }
        combs.push(comb);
    }

    return combs;
}
