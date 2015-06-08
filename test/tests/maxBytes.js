describe('after clearing and saving 5 runs', () => {
    beforeEach(async () => {
        await playbyplay.clear();
        await playbyplay.save('1st');
        await playbyplay.save('2nd');
        await playbyplay.save('3rd');
        await playbyplay.save('4th');
        await playbyplay.save('5th');
    });

    it('should load 5 runs', async () => {
        const runs = await playbyplay.load();
        expect(runs).to.deep.equal(['1st', '2nd', '3rd', '4th', '5th']);
    });

    it('should only keep the last 3 runs after saving with maxBytes = 40', async () => {
        await playbyplay.save('6th', {maxBytes: 40});
        const runs = await playbyplay.load();
        expect(runs).to.deep.equal(['4th', '5th', '6th']);
    });

    after(playbyplay.clear);
});
