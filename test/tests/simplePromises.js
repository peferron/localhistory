describe('after clearing', () => {
    beforeEach(playbyplay.clear);

    it('should load an empty array', () =>
        expect(playbyplay.load()).to.eventually.deep.equal([])
    );

    describe('and saving a first run', () => {
        const firstRun = {first: '1'};

        beforeEach(() => playbyplay.save(firstRun));

        it('should load the first run', () =>
            expect(playbyplay.load()).to.eventually.deep.equal([firstRun])
        );

        describe('and saving a second run different from the first', () => {
            const secondRun = {second: '2'};

            beforeEach(() => playbyplay.save(secondRun));

            it('should load the first and second runs', () =>
                expect(playbyplay.load()).to.eventually.deep.equal([firstRun, secondRun])
            );
        });

        describe('and saving the first run again', () => {
            beforeEach(() => playbyplay.save(firstRun));

            it('should load the first run only once', () =>
                expect(playbyplay.load()).to.eventually.deep.equal([firstRun])
            );
        });
    });
});
