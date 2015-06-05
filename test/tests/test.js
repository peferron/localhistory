describe('after clearing', () => {
    beforeEach((done) => {
        playbyplay.clear(done);
    });

    it('should load an empty array', (done) => {
        playbyplay.load((err, runs) => {
            expect(err).to.be.null;
            expect(runs).to.deep.equal([]);
            done();
        });
    });

    describe('and saving a first run', () => {
        const firstRun = {input: 'first', output: '1'};

        beforeEach((done) => {
            playbyplay.save(firstRun, done);
        });

        it('should load the first run', (done) => {
            playbyplay.load((err, runs) => {
                expect(err).to.be.null;
                expect(runs).to.deep.equal([firstRun]);
                done();
            });
        });

        describe('and saving a second run different from the first', () => {
            const secondRun = {input: 'second', output: '2'};

            beforeEach((done) => {
                playbyplay.save(secondRun, done);
            });

            it('should load the first and second runs', (done) => {
                playbyplay.load((err, runs) => {
                    expect(err).to.be.null;
                    expect(runs).to.deep.equal([firstRun, secondRun]);
                    done();
                });
            });
        });

        describe('and saving the first run again', () => {
            beforeEach((done) => {
                playbyplay.save(firstRun, done);
            });

            it('should load the first run only once', (done) => {
                playbyplay.load((err, runs) => {
                    expect(err).to.be.null;
                    expect(runs).to.deep.equal([firstRun]);
                    done();
                });
            });
        });
    });
});
