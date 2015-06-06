/* eslint-env jquery */
/* global playbyplay */

$(function() {
    function getOutput(input) {
        var output = 0;
        for (var i = 0; i < input.length; i++) {
            output += input.charCodeAt(i);
        }

        return output;
    }

    $('#run').on('click', function() {
        var input = $('#input').val();
        var output = getOutput(input);

        playbyplay.save({
            input: input,
            output: output
        });

        $('#output').text(output);
    });

    $('#load').on('click', function() {
        var $header = $('<tr><th>Input</th><th>Output</th></tr>');

        playbyplay.load(function(err, runs) {
            if (err) {
                return;
            }

            var $runs = runs.reverse().map(function(run) {
                var $input = $('<td></td>').text(run.input);
                var $output = $('<td></td>').text(run.output);
                return $('<tr></tr>').append($input, $output);
            });

            var $table = $('<table></table>').append($header, $runs);

            $('#history').html($table);
        });
    });

    $('#clear').on('click', function() {
        playbyplay.clear();
        $('#history').html('');
    });
});
