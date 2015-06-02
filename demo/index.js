$(function() {
    $('#run').on('click', function() {
        var input = $('#input').val();
        var output = encodeURIComponent(input);

        // pbp.save({
        //     input: input,
        //     output: output
        // });

        $('#output').text(output);
    });
});
