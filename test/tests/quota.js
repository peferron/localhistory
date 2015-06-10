describe('after clearing', () => {
    let tooLong;
    let halfTooLong1;
    let halfTooLong2;

    function init() {
        const key = 'playbyplay_trash_K79kxaC%I8HrRGDoousr';
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

        halfTooLong1 = tooLong.substring(0, tooLong.length / 2);
        halfTooLong2 = halfTooLong1.substring(0, halfTooLong1.length - 1) + '$';
    }

    beforeEach(async () => {
        await playbyplay.clear();
        if (!tooLong) {
            init();
        }
    });

    it('should return a quota error when saving a run that cannot fit in localStorage', () =>
        expect(playbyplay.save(tooLong, {maxBytes: Infinity})).to.be.rejectedWith(Error,
            `Could not save run of length ${tooLong.length + 4}, exceeds localStorage quota`)
    );

    describe('and saving two runs that cannot both fit in localStorage', () => {
        beforeEach(async () => {
            await playbyplay.save(halfTooLong1, {maxBytes: Infinity});
            await playbyplay.save(halfTooLong2, {maxBytes: Infinity});
        });

        it('should load the last run only', () =>
            expect(playbyplay.load()).to.eventually.deep.equal([halfTooLong2])
        );
    });

    afterEach(playbyplay.clear);
});
