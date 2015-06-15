describe('after clearing', () => {
    beforeEach(() => localhistory.clear('test'));

    describe('and saving a first entry', () => {
        const first = {first: '1'};

        beforeEach(() => localhistory.append('test', first));

        describe('and saving the first entry again with appendIfEqualToLast not set', () => {
            beforeEach(() => localhistory.append('test', first));

            it('should load the first entry twice', () =>
                expect(localhistory.load('test')).to.eventually.deep.equal([first, first])
            );
        });

        describe('and saving the first entry again with appendIfEqualToLast = false', () => {
            beforeEach(() => localhistory.append('test', first, {appendIfEqualToLast: false}));

            it('should load the first entry only once', () =>
                expect(localhistory.load('test')).to.eventually.deep.equal([first])
            );
        });
    });

    after(() => localhistory.clear('test'));
});
