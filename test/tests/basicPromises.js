describe('after clearing', () => {
    beforeEach(() => localhistory.clear('test'));

    it('should load an empty array', () =>
        expect(localhistory.load('test')).to.eventually.deep.equal([])
    );

    describe('and saving a first entry', () => {
        const first = {first: '1'};

        beforeEach(() => localhistory.append('test', first));

        it('should load the first entry', () =>
            expect(localhistory.load('test')).to.eventually.deep.equal([first])
        );

        describe('and saving a second entry', () => {
            const second = {second: '2'};

            beforeEach(() => localhistory.append('test', second));

            it('should load the first and second entries', () =>
                expect(localhistory.load('test')).to.eventually.deep.equal([first, second])
            );
        });
    });

    after(() => localhistory.clear('test'));
});
