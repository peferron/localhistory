describe('after clearing', () => {
    beforeEach(() => localhistory.clear('test'));

    const entry = {first: '1'};

    describe('and appending an entry without options', () => {
        beforeEach(() => localhistory.append('test', entry));

        it('should load the first entry', () =>
            expect(localhistory.load('test')).to.eventually.deep.equal([entry])
        );
    });

    describe('and appending an entry with options = null', () => {
        const first = {first: '1'};

        beforeEach(() => localhistory.append('test', first, null));

        it('should load the first entry', () =>
            expect(localhistory.load('test')).to.eventually.deep.equal([entry])
        );
    });

    after(() => localhistory.clear('test'));
});
