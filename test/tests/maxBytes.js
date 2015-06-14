describe('after clearing', () => {
    beforeEach(localhistory.clear);

    it('should return an error if saving a run bigger than maxBytes', () =>
        expect(localhistory.append('6th', {maxBytes: 10})).to.be.rejectedWith(Error,
            'Could not append run of length 7 (14 bytes), maxBytes is 10')
    );

    describe('and saving 5 runs without maxBytes', () => {
        beforeEach(async () => {
            await localhistory.clear();
            await localhistory.append('1st');
            await localhistory.append('2nd');
            await localhistory.append('3rd');
            await localhistory.append('4th');
            await localhistory.append('5th');
        });

        it('should load 5 runs', async () =>
            expect(localhistory.load()).to.eventually.deep.equal(
                ['1st', '2nd', '3rd', '4th', '5th'])
        );

        describe('and saving 1 run with maxBytes = 40', () => {
            beforeEach(() =>
                localhistory.append('6th', {maxBytes: 40})
            );

            it('should load the last 3 runs only', () =>
                expect(localhistory.load()).to.eventually.deep.equal(['4th', '5th', '6th'])
            );
        });
    });

    after(localhistory.clear);
});
