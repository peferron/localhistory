describe('after clearing', () => {
    beforeEach(playbyplay.clear);

    it('should return an error if saving with maxRuns = 0', () =>
        expect(playbyplay.save('6th', {maxRuns: 0})).to.be.rejectedWith(Error,
            'Could not save run, maxRuns is 0')
    );

    describe('and saving 5 runs without maxBytes', () => {
        beforeEach(async () => {
            await playbyplay.clear();
            await playbyplay.save('1st');
            await playbyplay.save('2nd');
            await playbyplay.save('3rd');
            await playbyplay.save('4th');
            await playbyplay.save('5th');
        });

        it('should load 5 runs', async () =>
            expect(playbyplay.load()).to.eventually.deep.equal(['1st', '2nd', '3rd', '4th', '5th'])
        );

        describe('and saving 1 run with maxRuns = 3', () => {
            beforeEach(() =>
                playbyplay.save('6th', {maxRuns: 3})
            );

            it('should load the last 3 runs only', () =>
                expect(playbyplay.load()).to.eventually.deep.equal(['4th', '5th', '6th'])
            );
        });
    });

    after(playbyplay.clear);
});
