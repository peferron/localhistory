describe('after clearing', () => {
    beforeEach(async () => {
        await localhistory.clear();
    });

    it('should load an empty array', async () => {
        const runs = await localhistory.load();
        expect(runs).to.deep.equal([]);
    });

    describe('and saving a first run', () => {
        const firstRun = {first: '1'};

        beforeEach(async () => {
            await localhistory.save(firstRun);
        });

        it('should load the first run', async () => {
            const runs = await localhistory.load();
            expect(runs).to.deep.equal([firstRun]);
        });

        describe('and saving a second run different from the first', () => {
            const secondRun = {second: '2'};

            beforeEach(async () => {
                await localhistory.save(secondRun);
            });

            it('should load the first and second runs', async () => {
                const runs = await localhistory.load();
                expect(runs).to.deep.equal([firstRun, secondRun]);
            });
        });

        describe('and saving the first run again', () => {
            beforeEach(async () => {
                await localhistory.save(firstRun);
            });

            it('should load the first run only once', async () => {
                const runs = await localhistory.load();
                expect(runs).to.deep.equal([firstRun]);
            });
        });
    });

    after(async () => {
        await localhistory.clear();
    });
});
