describe('after a clear', () => {
    beforeEach(playbyplay.clear);

    it('should load an empty array', () => {
        const runs = playbyplay.load();
        expect(runs).to.deep.equal([]);
    });

    describe('and a save', () => {
        const run = {input: 'hello', output: 'world'};

        beforeEach((done) => {
            playbyplay.save(run, done);
        });

        it('should load the previously saved run', () => {
            const runs = playbyplay.load();
            expect(runs).to.deep.equal([run]);
        });
    });
});
