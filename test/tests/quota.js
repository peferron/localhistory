describe('after clearing', () => {
    let tooLong;
    let halfTooLong1;
    let halfTooLong2;

    function init() {
        const key = 'localhistory_trash_K79kxaC%I8HrRGDoousr';
        tooLong = 'startups would kill to grow this fast';
        while (true) { // eslint-disable-line no-constant-condition
            tooLong += tooLong;
            try {
                localStorage[key] = tooLong;
            } catch(e) {
                break;
            }
        }
        localStorage.removeItem(key);


        // Splitting tooLong in two creates two strings that are short enough to be appended
        // successfully, but too long to be *both* contained in history at the same time.
        // We change an arbitrary character in the second string to make both strings different,
        // otherwise append() will consider it a duplicate.
        halfTooLong1 = tooLong.substring(0, tooLong.length / 2);
        halfTooLong2 = halfTooLong1.substring(0, halfTooLong1.length - 1) + '$';
    }

    beforeEach(async () => {
        await localhistory.clear('test');
        if (!tooLong) {
            init();
        }
    });

    it('should return a quota error when appending a entry that cannot fit in localStorage', () =>
        expect(localhistory.append('test', tooLong, {maxBytes: Infinity})).to.be.rejectedWith(Error,
            `Could not append entry of length ${tooLong.length + 4}, exceeds localStorage quota`)
    );

    describe('and appending two entries that cannot both fit in localStorage', () => {
        beforeEach(async () => {
            await localhistory.append('test', halfTooLong1, {maxBytes: Infinity});
            await localhistory.append('test', halfTooLong2, {maxBytes: Infinity});
        });

        it('should load the last entry only', () =>
            expect(localhistory.load('test')).to.eventually.deep.equal([halfTooLong2])
        );
    });

    afterEach(() => localhistory.clear('test'));
});
