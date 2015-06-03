$(function() {
    $('#run').on('click', function() {
        var input = $('#input').val();
        var output = encodeURIComponent(input);

        playbyplay.save({
            input: input,
            output: output
        });

        $('#output').text(output);
    });

    $('#load').on('click', function() {
        var $header = $('<tr><th>Input</th><th>Output</th></tr>');

        var runs = playbyplay.load();
        var $runs = runs.reverse().map(function(run) {
            var $input = $('<td></td>').text(run.input);
            var $output = $('<td></td>').text(run.output);
            return $('<tr></tr>').append($input, $output);
        });

        var $history = $('<table></table>').append($header, $runs);

        $('#history').html($history);
    });

    $('#clear').on('click', function() {
        playbyplay.clear();
        $('#history').html('');
    });
});
