describe('after clearing', () => {
    before(playbyplay.clear);

    let savedRuns = [];

    async function steps() {
        for (let i = 0; i < 200; i++) {
            await step();
        }
    }

    async function step() {
        const r = Math.random();
        if (r < 0.8) {
            await save();
        } else if (r < 0.95) {
            await load();
        } else {
            await clear();
        }
    }

    async function save() {
        const run = Math.random();
        await playbyplay.save(run);
        savedRuns.push(run);
    }

    async function load() {
        const runs = await playbyplay.load();
        expect(runs).to.deep.equal(savedRuns);
    }

    async function clear() {
        await playbyplay.clear();
        savedRuns = [];
    }

    it('should keep in sync across all steps', steps);

    after(playbyplay.clear);
});
