import support from '../../src/support';

describe('support()', function() {
    it('should pass the check', () => {
        expect(support()).to.be.true;
    });
});
