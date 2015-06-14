describe('after clearing', () => {
    beforeEach(done => {
        localhistory.clear('test', done);
    });

    it('should load an empty array', done => {
        localhistory.load('test', (err, entries) => {
            expect(err).to.be.null;
            expect(entries).to.deep.equal([]);
            done();
        });
    });

    describe('and saving a first entry', () => {
        const firstEntry = {first: '1'};

        beforeEach((done) => {
            localhistory.append('test', firstEntry, done);
        });

        it('should load the first entry', done => {
            localhistory.load('test', (err, entries) => {
                expect(err).to.be.null;
                expect(entries).to.deep.equal([firstEntry]);
                done();
            });
        });

        describe('and saving a second entry different from the first', () => {
            const secondEntry = {second: '2'};

            beforeEach((done) => {
                localhistory.append('test', secondEntry, done);
            });

            it('should load the first and second entries', done => {
                localhistory.load('test', (err, entries) => {
                    expect(err).to.be.null;
                    expect(entries).to.deep.equal([firstEntry, secondEntry]);
                    done();
                });
            });
        });

        describe('and saving the first entry again', () => {
            beforeEach((done) => {
                localhistory.append('test', firstEntry, done);
            });

            it('should load the first entry only once', done => {
                localhistory.load('test', (err, entries) => {
                    expect(err).to.be.null;
                    expect(entries).to.deep.equal([firstEntry]);
                    done();
                });
            });
        });
    });

    after(done => {
        localhistory.clear('test', done);
    });
});
