describe('after clearing', () => {
    beforeEach(localhistory.clear);

    it('should load an empty array', () =>
        expect(localhistory.load()).to.eventually.deep.equal([])
    );

    describe('and saving a first entry', () => {
        const firstEntry = {first: '1'};

        beforeEach(() => localhistory.append(firstEntry));

        it('should load the first entry', () =>
            expect(localhistory.load()).to.eventually.deep.equal([firstEntry])
        );

        describe('and saving a second entry different from the first', () => {
            const secondEntry = {second: '2'};

            beforeEach(() => localhistory.append(secondEntry));

            it('should load the first and second entries', () =>
                expect(localhistory.load()).to.eventually.deep.equal([firstEntry, secondEntry])
            );
        });

        describe('and saving the first entry again', () => {
            beforeEach(() => localhistory.append(firstEntry));

            it('should load the first entry only once', () =>
                expect(localhistory.load()).to.eventually.deep.equal([firstEntry])
            );
        });
    });

    after(localhistory.clear);
});
