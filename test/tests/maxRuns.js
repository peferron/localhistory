describe('after clearing', () => {
    beforeEach(() => localhistory.clear('test'));

    it('should return an error if saving with maxEntries = 0', () =>
        expect(localhistory.append('test', '6th', {maxEntries: 0})).to.be.rejectedWith(Error,
            'Could not append entry, maxEntries is 0')
    );

    describe('and saving 5 entries without maxBytes', () => {
        beforeEach(async () => {
            await localhistory.clear('test');
            await localhistory.append('test', '1st');
            await localhistory.append('test', '2nd');
            await localhistory.append('test', '3rd');
            await localhistory.append('test', '4th');
            await localhistory.append('test', '5th');
        });

        it('should load 5 entries', async () =>
            expect(localhistory.load('test')).to.eventually.deep.equal(
                ['1st', '2nd', '3rd', '4th', '5th'])
        );

        describe('and saving 1 entry with maxEntries = 3', () => {
            beforeEach(() =>
                localhistory.append('test', '6th', {maxEntries: 3})
            );

            it('should load the last 3 entries only', () =>
                expect(localhistory.load('test')).to.eventually.deep.equal(['4th', '5th', '6th'])
            );
        });
    });

    after(() => localhistory.clear('test'));
});
