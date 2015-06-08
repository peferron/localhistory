describe('after clearing', () => {
    beforeEach(playbyplay.clear);

    it('should return an error if saving a run bigger than maxBytes', () =>
        expect(playbyplay.save('6th', {maxBytes: 10})).to.be.rejectedWith(Error,
            'Could not save run of length 7 (14 bytes), maxBytes is 10')
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

        describe('and saving 1 run with maxBytes = 40', () => {
            beforeEach(() =>
                playbyplay.save('6th', {maxBytes: 40})
            );

            it('should load the last 3 runs only', () =>
                expect(playbyplay.load()).to.eventually.deep.equal(['4th', '5th', '6th'])
            );
        });
    });

    after(playbyplay.clear);
});
