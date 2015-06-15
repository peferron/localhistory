describe('after clearing', () => {
    beforeEach(async () => {
        await localhistory.clear('test');
    });

    it('should load an empty array', async () => {
        const entries = await localhistory.load('test');
        expect(entries).to.deep.equal([]);
    });

    describe('and saving a first entry', () => {
        const firstEntry = {first: '1'};

        beforeEach(async () => {
            await localhistory.append('test', firstEntry);
        });

        it('should load the first entry', async () => {
            const entries = await localhistory.load('test');
            expect(entries).to.deep.equal([firstEntry]);
        });

        describe('and saving a second entry', () => {
            const secondEntry = {second: '2'};

            beforeEach(async () => {
                await localhistory.append('test', secondEntry);
            });

            it('should load the first and second entries', async () => {
                const entries = await localhistory.load('test');
                expect(entries).to.deep.equal([firstEntry, secondEntry]);
            });
        });
    });

    after(async () => {
        await localhistory.clear('test');
    });
});
