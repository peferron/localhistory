describe('after clearing', () => {
    beforeEach(async () => {
        await localhistory.clear('test');
    });

    it('should load an empty array', async () => {
        const entries = await localhistory.load('test');
        expect(entries).to.deep.equal([]);
    });

    describe('and saving a first entry', () => {
        const first = {first: '1'};

        beforeEach(async () => {
            await localhistory.append('test', first);
        });

        it('should load the first entry', async () => {
            const entries = await localhistory.load('test');
            expect(entries).to.deep.equal([first]);
        });

        describe('and saving a second entry', () => {
            const second = {second: '2'};

            beforeEach(async () => {
                await localhistory.append('test', second);
            });

            it('should load the first and second entries', async () => {
                const entries = await localhistory.load('test');
                expect(entries).to.deep.equal([first, second]);
            });
        });
    });

    after(async () => {
        await localhistory.clear('test');
    });
});
