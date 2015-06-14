describe('after clearing', () => {
    beforeEach(localhistory.clear);

    it('should return an error if saving with maxEntries = 0', () =>
        expect(localhistory.append('6th', {maxEntries: 0})).to.be.rejectedWith(Error,
            'Could not append entry, maxEntries is 0')
    );

    describe('and saving 5 entries without maxBytes', () => {
        beforeEach(async () => {
            await localhistory.clear();
            await localhistory.append('1st');
            await localhistory.append('2nd');
            await localhistory.append('3rd');
            await localhistory.append('4th');
            await localhistory.append('5th');
        });

        it('should load 5 entries', async () =>
            expect(localhistory.load()).to.eventually.deep.equal(
                ['1st', '2nd', '3rd', '4th', '5th'])
        );

        describe('and saving 1 entry with maxEntries = 3', () => {
            beforeEach(() =>
                localhistory.append('6th', {maxEntries: 3})
            );

            it('should load the last 3 entries only', () =>
                expect(localhistory.load()).to.eventually.deep.equal(['4th', '5th', '6th'])
            );
        });
    });

    after(localhistory.clear);
});
