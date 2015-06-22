describe('after clearing', () => {
    const maxEntries = 100;
    let appendedEntries;

    async function append() {
        const entry = Math.random();

        await localhistory.append('test', entry, {maxEntries});

        appendedEntries.push(entry);
        if (appendedEntries.length > maxEntries) {
            appendedEntries.shift();
        }
    }

    async function load() {
        const entries = await localhistory.load('test');
        expect(entries).to.deep.equal(appendedEntries);
    }

    async function clear() {
        await localhistory.clear('test');
        appendedEntries = [];
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

    it('should keep in sync when appending more entries than maxEntries', async () => {
        for (let i = 0; i < 3 * maxEntries; i++) {
            await append();
            if (Math.random() < 0.2) {
                await load();
            }
        }
    });

    after(() => localhistory.clear('test'));
});
