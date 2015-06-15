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
        const first = {first: '1'};

        beforeEach((done) => {
            localhistory.append('test', first, done);
        });

        it('should load the first entry', done => {
            localhistory.load('test', (err, entries) => {
                expect(err).to.be.null;
                expect(entries).to.deep.equal([first]);
                done();
            });
        });

        describe('and saving a second entry', () => {
            const second = {second: '2'};

            beforeEach((done) => {
                localhistory.append('test', second, done);
            });

            it('should load the first and second entries', done => {
                localhistory.load('test', (err, entries) => {
                    expect(err).to.be.null;
                    expect(entries).to.deep.equal([first, second]);
                    done();
                });
            });
        });
    });

    after(done => {
        localhistory.clear('test', done);
    });
});
