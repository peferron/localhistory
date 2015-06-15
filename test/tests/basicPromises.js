describe('after clearing', () => {
    beforeEach(() => localhistory.clear('test'));

    it('should load an empty array', () =>
        expect(localhistory.load('test')).to.eventually.deep.equal([])
    );

    describe('and saving a first entry', () => {
        const firstEntry = {first: '1'};

        beforeEach(() => localhistory.append('test', firstEntry));

        it('should load the first entry', () =>
            expect(localhistory.load('test')).to.eventually.deep.equal([firstEntry])
        );

        describe('and saving a second entry', () => {
            const secondEntry = {second: '2'};

            beforeEach(() => localhistory.append('test', secondEntry));

            it('should load the first and second entries', () =>
                expect(localhistory.load('test')).to.eventually.deep.equal(
                    [firstEntry, secondEntry])
            );
        });
    });

    after(() => localhistory.clear('test'));
});
