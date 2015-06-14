// This is the key from storage.js.
const runsKey = 'localhistory_runs_A*O%y21#Q1WSh^f09YO!';

describe('after storing non-JSON data', () => {
    beforeEach(() => {
        localStorage[runsKey] = 'Not JSON!';
    });

    it('should return an error on load', () =>
        expect(localhistory.load()).to.be.rejectedWith(Error,
            `SyntaxError: Unable to parse JSON string`)
    );

    describe('and saving a first run', () => {
        beforeEach(() => localhistory.save('first'));

        it('should load the first run', () =>
            expect(localhistory.load()).to.eventually.deep.equal(['first'])
        );
    });

    after(localhistory.clear);
});

describe('after storing non-Array data', () => {
    beforeEach(() => {
        localStorage[runsKey] = '"Not an Array"';
    });

    it('should return an error on load', () =>
        expect(localhistory.load()).to.be.rejectedWith(Error, `Error: Loaded runs are not an Array`)
    );

    describe('and saving a first run', () => {
        beforeEach(() => localhistory.save('first'));

        it('should load the first run', () =>
            expect(localhistory.load()).to.eventually.deep.equal(['first'])
        );
    });

    after(localhistory.clear);
});
