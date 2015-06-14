// This is the key from storage.js.
const entriesKey = 'localhistory_entries_A*O%y21#Q1WSh^f09YO!';

describe('after storing non-JSON data', () => {
    beforeEach(() => {
        localStorage[entriesKey] = 'Not JSON!';
    });

    it('should return an error on load', () =>
        expect(localhistory.load()).to.be.rejectedWith(Error,
            `SyntaxError: Unable to parse JSON string`)
    );

    describe('and saving a first entry', () => {
        beforeEach(() => localhistory.append('first'));

        it('should load the first entry', () =>
            expect(localhistory.load()).to.eventually.deep.equal(['first'])
        );
    });

    after(localhistory.clear);
});

describe('after storing non-Array data', () => {
    beforeEach(() => {
        localStorage[entriesKey] = '"Not an Array"';
    });

    it('should return an error on load', () =>
        expect(localhistory.load()).to.be.rejectedWith(Error,
            `Error: Loaded entries are not an Array`)
    );

    describe('and saving a first entry', () => {
        beforeEach(() => localhistory.append('first'));

        it('should load the first entry', () =>
            expect(localhistory.load()).to.eventually.deep.equal(['first'])
        );
    });

    after(localhistory.clear);
});
