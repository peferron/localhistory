describe('after clearing', () => {
    beforeEach(async () => {
        await localhistory.clear();
    });

    it('should load an empty array', async () => {
        const entries = await localhistory.load();
        expect(entries).to.deep.equal([]);
    });

    describe('and saving a first entry', () => {
        const firstEntry = {first: '1'};

        beforeEach(async () => {
            await localhistory.append(firstEntry);
        });

        it('should load the first entry', async () => {
            const entries = await localhistory.load();
            expect(entries).to.deep.equal([firstEntry]);
        });

        describe('and saving a second entry different from the first', () => {
            const secondEntry = {second: '2'};

            beforeEach(async () => {
                await localhistory.append(secondEntry);
            });

            it('should load the first and second entries', async () => {
                const entries = await localhistory.load();
                expect(entries).to.deep.equal([firstEntry, secondEntry]);
            });
        });

        describe('and saving the first entry again', () => {
            beforeEach(async () => {
                await localhistory.append(firstEntry);
            });

            it('should load the first entry only once', async () => {
                const entries = await localhistory.load();
                expect(entries).to.deep.equal([firstEntry]);
            });
        });
    });

    after(async () => {
        await localhistory.clear();
    });
});
