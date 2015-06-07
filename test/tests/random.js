describe('after clearing', () => {
    const maxRuns = 100;
    let savedRuns;

    async function save() {
        const run = Math.random();

        await playbyplay.save(run, {maxRuns});

        savedRuns.push(run);
        if (savedRuns.length > maxRuns) {
            savedRuns.shift();
        }
    }

    async function load() {
        const runs = await playbyplay.load();
        expect(runs).to.deep.equal(savedRuns);
    }

    async function clear() {
        await playbyplay.clear();
        savedRuns = [];
    }

    beforeEach(clear);

    it('should keep in sync when executing random operations', async () => {
        for (let i = 0; i < 200; i++) {
            const r = Math.random();
            if (r < 0.8) {
                await save();
            } else if (r < 0.95) {
                await load();
            } else {
                await clear();
            }
        }
    });

    it('should keep in sync when saving more runs than maxRuns', async () => {
        for (let i = 0; i < 3 * maxRuns; i++) {
            await save();
            if (Math.random() < 0.2) {
                await load();
            }
        }
    });

    after(playbyplay.clear);
});
