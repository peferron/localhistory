describe('hello', () => {
    it('world', () => {
        playbyplay.save({input: 'hello', output: 'world'});
        expect(true).to.be.true;
    });
});
