$(function() {
    var key = 'locahistory_demo';

    $('#append').on('click', function() {
        var entry = $('#entry').val();
        localhistory.append(key, entry);
    });

    $('#load').on('click', function() {
        localhistory.load(key, function(err, entries) {
            if (err) {
                alert(err);
                return;
            }

            var $entries = entries.reverse().map(function(entry) {
                return $('<li>').append(JSON.stringify(entry));
            });

            $('#history').html($entries);
        });
    });

    $('#clear').on('click', function() {
        localhistory.clear(key);
        $('#history').html('');
    });
});
