describe('after clearing', () => {
    beforeEach(done => {
        localhistory.clear(done);
    });

    it('should load an empty array', done => {
        localhistory.load((err, runs) => {
            expect(err).to.be.null;
            expect(runs).to.deep.equal([]);
            done();
        });
    });

    describe('and saving a first run', () => {
        const firstRun = {first: '1'};

        beforeEach((done) => {
            localhistory.append(firstRun, done);
        });

        it('should load the first run', done => {
            localhistory.load((err, runs) => {
                expect(err).to.be.null;
                expect(runs).to.deep.equal([firstRun]);
                done();
            });
        });

        describe('and saving a second run different from the first', () => {
            const secondRun = {second: '2'};

            beforeEach((done) => {
                localhistory.append(secondRun, done);
            });

            it('should load the first and second runs', done => {
                localhistory.load((err, runs) => {
                    expect(err).to.be.null;
                    expect(runs).to.deep.equal([firstRun, secondRun]);
                    done();
                });
            });
        });

        describe('and saving the first run again', () => {
            beforeEach((done) => {
                localhistory.append(firstRun, done);
            });

            it('should load the first run only once', done => {
                localhistory.load((err, runs) => {
                    expect(err).to.be.null;
                    expect(runs).to.deep.equal([firstRun]);
                    done();
                });
            });
        });
    });

    after(done => {
        localhistory.clear(done);
    });
});
