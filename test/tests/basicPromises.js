describe('after clearing', () => {
    beforeEach(localhistory.clear);

    it('should load an empty array', () =>
        expect(localhistory.load()).to.eventually.deep.equal([])
    );

    describe('and saving a first run', () => {
        const firstRun = {first: '1'};

        beforeEach(() => localhistory.append(firstRun));

        it('should load the first run', () =>
            expect(localhistory.load()).to.eventually.deep.equal([firstRun])
        );

        describe('and saving a second run different from the first', () => {
            const secondRun = {second: '2'};

            beforeEach(() => localhistory.append(secondRun));

            it('should load the first and second runs', () =>
                expect(localhistory.load()).to.eventually.deep.equal([firstRun, secondRun])
            );
        });

        describe('and saving the first run again', () => {
            beforeEach(() => localhistory.append(firstRun));

            it('should load the first run only once', () =>
                expect(localhistory.load()).to.eventually.deep.equal([firstRun])
            );
        });
    });

    after(localhistory.clear);
});
