describe('after filling localStorage quota', () => {
    const key = 'playbyplay_trash_K79kxaC%I8HrRGDoousr';

    let tooLong;

    beforeEach(done => {
        tooLong = 'startups would kill to grow this fast';
        while (true) { // eslint-disable-line no-constant-condition
            tooLong += tooLong;
            try {
                localStorage[key] = tooLong;
            } catch(e) {
                break;
            }
        }
        done();
    });

    it('should return a quota error on save', () =>
        expect(playbyplay.save(tooLong, {maxBytes: Infinity})).to.be.rejectedWith(Error,
            `Could not save run of length ${tooLong.length + 4}, exceeds localStorage quota`)
    );

    after(async () => {
        localStorage.removeItem(key);
        await playbyplay.clear();
    });
});
