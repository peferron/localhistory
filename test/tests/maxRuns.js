describe('after clearing', () => {
    beforeEach(localhistory.clear);

    it('should return an error if saving with maxRuns = 0', () =>
        expect(localhistory.save('6th', {maxRuns: 0})).to.be.rejectedWith(Error,
            'Could not save run, maxRuns is 0')
    );

    describe('and saving 5 runs without maxBytes', () => {
        beforeEach(async () => {
            await localhistory.clear();
            await localhistory.save('1st');
            await localhistory.save('2nd');
            await localhistory.save('3rd');
            await localhistory.save('4th');
            await localhistory.save('5th');
        });

        it('should load 5 runs', async () =>
            expect(localhistory.load()).to.eventually.deep.equal(['1st', '2nd', '3rd', '4th', '5th'])
        );

        describe('and saving 1 run with maxRuns = 3', () => {
            beforeEach(() =>
                localhistory.save('6th', {maxRuns: 3})
            );

            it('should load the last 3 runs only', () =>
                expect(localhistory.load()).to.eventually.deep.equal(['4th', '5th', '6th'])
            );
        });
    });

    after(localhistory.clear);
});
