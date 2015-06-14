describe('after clearing', () => {
    const maxRuns = 100;
    let appendedRuns;

    async function append() {
        const run = Math.random();

        await localhistory.append(run, {maxRuns});

        appendedRuns.push(run);
        if (appendedRuns.length > maxRuns) {
            appendedRuns.shift();
        }
    }

    async function load() {
        const runs = await localhistory.load();
        expect(runs).to.deep.equal(appendedRuns);
    }

    async function clear() {
        await localhistory.clear();
        appendedRuns = [];
    }

    beforeEach(clear);

    it('should keep in sync when executing random operations', async () => {
        for (let i = 0; i < 200; i++) {
            const r = Math.random();
            if (r < 0.8) {
                await append();
            } else if (r < 0.95) {
                await load();
            } else {
                await clear();
            }
        }
    });

    it('should keep in sync when saving more runs than maxRuns', async () => {
        for (let i = 0; i < 3 * maxRuns; i++) {
            await append();
            if (Math.random() < 0.2) {
                await load();
            }
        }
    });

    after(localhistory.clear);
});
