describe('after storing non-JSON data', () => {
    beforeEach(() => {
        localStorage.test = 'Not JSON!';
    });

    it('should return an error on load', () =>
        expect(localhistory.load('test')).to.be.rejectedWith(Error,
            `SyntaxError: Unable to parse JSON string`)
    );

    describe('and appending a first entry', () => {
        beforeEach(() => localhistory.append('test', 'first'));

        it('should load the first entry', () =>
            expect(localhistory.load('test')).to.eventually.deep.equal(['first'])
        );
    });

    after(() => localhistory.clear('test'));
});

describe('after storing non-Array data', () => {
    beforeEach(() => {
        localStorage.test = '"Not an Array"';
    });

    it('should return an error on load', () =>
        expect(localhistory.load('test')).to.be.rejectedWith(Error,
            `Error: Loaded entries are not an Array`)
    );

    describe('and appending a first entry', () => {
        beforeEach(() => localhistory.append('test', 'first'));

        it('should load the first entry', () =>
            expect(localhistory.load('test')).to.eventually.deep.equal(['first'])
        );
    });

    after(() => localhistory.clear('test'));
});
