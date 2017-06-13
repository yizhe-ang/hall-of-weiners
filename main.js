(function(m) {
// Module that receives the data and initializes the app
    // MAIN DATA OBJECT
    m.data = {};

    // PLACEMENT INFO
    var PLACEMENT_PTS = {
                        '1st':3,
                        '2nd':2,
                        '3rd':1,
                        '3rd-4th':1,
                    };

    m.load = function() {
        d3.json('data/valve_events_data_final.json', function(error,data) {
            ready(data);
        });
    };
    function ready(data) {
        // PREPARING THE DATA
        m.data = data;
        m.data.forEach(function(d) {
            d.images = JSON.parse(d.images.replace(/'/g, '"'));
        });
        // Nests the data according to player name
        m.data = d3.nest()
            .key(function(d) { return d.name; })
            .entries(m.data);

        // Calculate the placement points
        m.data.forEach(function(d) {
            var points = 0;
            d.values.forEach(function(e) {
                if (e.placement in PLACEMENT_PTS) {
                    points += PLACEMENT_PTS[e.placement];
                }
            });
            d.points = points;
        });

        // Then sort descending by number of events
        m.data.sort(function(a, b) {
            return (b.values.length - a.values.length) || (b.points - a.points);
        });
        // console.log(m.data);
        // Filter for participation in >50% of events
        m.data = m.data.filter(function(d) {
            return d.values.length >= 6;
        });
        // console.log(m.data);


        // Render header
        m.renderHeader();
        // Render chart
        m.renderChart();
    }






}(window.m = window.m || {}));
