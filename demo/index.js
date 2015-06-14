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

        localhistory.save({
            input: input,
            output: output
        });

        $('#output').text(output);
    });

    $('#load').on('click', function() {
        var $header = $('<tr><th>Input</th><th>Output</th></tr>');

        localhistory.load(function(err, entries) {
            if (err) {
                return;
            }

            var $entries = entries.reverse().map(function(entry) {
                var $input = $('<td></td>').text(entry.input);
                var $output = $('<td></td>').text(entry.output);
                return $('<tr></tr>').append($input, $output);
            });

            var $table = $('<table></table>').append($header, $entries);

            $('#history').html($table);
        });
    });

    $('#clear').on('click', function() {
        localhistory.clear();
        $('#history').html('');
    });
});
