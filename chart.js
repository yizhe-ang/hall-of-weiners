(function (m) {

var VALVE_EVENTS = [
                {event:'The International 2011', img:'the_international', date:'2011-08-17'},
                {event:'The International 2012', img:'the_international', date:'2012-08-26'},
                {event:'The International 2013', img:'the_international', date:'2013-08-02'},
                {event:'The International 2014', img:'the_international', date:'2014-07-08'},
                {event:'The International 2015', img:'the_international', date:'2015-07-27'},
                {event:'Frankfurt Major 2015', img:'fall_major', date:'2015-11-13'},
                {event:'The Shanghai Major 2016', img:'winter_major', date:'2016-02-25'},
                {event:'The Manila Major 2016', img:'spring_major', date:'2016-06-03'},
                {event:'The International 2016', img:'the_international', date:'2016-08-02'},
                {event:'The Boston Major 2016', img:'fall_major', date:'2016-12-03'},
                {event:'The Kiev Major 2017', img:'winter_major', date:'2017-04-27'},
                {event:'The International 2017', img:'the_international', date:'2017-08-07'},
            ];

var PLACEMENTS = ['5th-8th',
                  '9th-12th',
                  '3rd',
                  '13th-14th',
                  '5th-6th',
                  '3rd-4th',
                  '9th-16th',
                  '13th-16th',
                  '2nd',
                  '9th-10th',
                  '4th',
                  '1st',
                  'TBA',
                  '15th-16th',
                  '11th-12th',
                  '7th-8th'];



var PLACEMENT_COLORS = {
                        '1st':'gold',
                        '2nd':'silver',
                        '3rd':'#d98a78',
                        // '4th':'sandybrown',
                        '3rd-4th':'#d98a78',
                    };

// string stripper function
var strip = function(string) {
    return string.replace(/ /g,''); // strips all the spaces
};

// dimensions
var margin = {top:10, bottom:10, left:180, right:50};


// WHAT TO DO WITH DATA???
// 1. nest it - player
// 2. Sort by number of appearances and achievements


// Creating the first table line (vertical)
// svg.append('line')
//     .attr('x1', margin.left)
//     .attr('x2', margin.left)
//     .attr('y1', 0)
//     .attr('y2', 50)
//     .attr('stroke', 'black')
//     .attr('stroke-width', 4);
// The rest of the table lines (vertical)
// VALVE_EVENTS.forEach(function(d, i) {
//     svg.append('line')
//         .attr('x1', margin.left + (cellWidth*(i+1)))
//         .attr('x2', margin.left + (cellWidth*(i+1)))
//         .attr('y1', 0)
//         .attr('y2', 50)
//         .attr('stroke', 'black')
//         .attr('opacity', 0.2)
//         .attr('stroke-width', 2);
// });

// HEADER FUNCTION
m.renderHeader = function() {
        // Defining svg attributes
        var chartHolder = d3.select('#table-header');
        var boundingRect = chartHolder.node().getBoundingClientRect();
        var width = boundingRect.width;
        var height = boundingRect.height;
        var cellWidth = (width-margin.left-margin.right)/12.0;

        var svg = chartHolder.select('svg')
                    .attr('width', width)
                    .attr('height', height);

        var tooltip = d3.select('#header-tooltip');
        var eventHeaders = svg.selectAll('image')
                            .data(VALVE_EVENTS);
        d3.select('h1').transition().style('opacity', 1.0);
        eventHeaders.enter().append('image')
                    .attr('id', function(d) { return strip(d.event); }) // to identify the event headers
                    .attr('xlink:href', function(d) { return 'images/'+d.img+'.png'; })
                    .attr('x', function(d, i) { return margin.left + (cellWidth/2.0) + (cellWidth*i) - 12.5; })
                    .attr('y', 10)
                    .attr('height', '25px')
                    .attr('width', '25px')
                    .style('opacity', 0)
                    // tooltip shizz
                    .on('mouseover', function(d) {
                        var header = d3.select(this);

                        // tooltip contains name of event and date
                        tooltip.style('opacity', 1.0);
                        tooltip.select('h2').text(d.event);
                        tooltip.select('p').text(d.date);
                        // adjust x position of tooltip
                        var w = parseInt(tooltip.style('width')),
                            h = parseInt(tooltip.style('height'));
                        var x = parseInt(header.attr('x')),
                            y = parseInt(header.attr('y'));
                        console.log(w/2);

                        tooltip.style('left', x-(w/2)+'px')
                                .style('top', y+37+'px');
                        console.log(tooltip.style('left'));

                    })
                    .on('mouseout', function(d) {
                        tooltip.style('opacity', 0);
                    });
        svg.selectAll('image').transition()
                    .style('opacity', 1.0);
        // eventHeaders.on('mouseover', function() {
        //     console.log('mouseover');
        //     header = d3.select(this);
        //     header.transition(1000).attr('filter', 'url(#brightness)');
        // })
        //             .on('mouseout', function() {
        //     header = d3.select(this);
        //     header.transition(1000).attr('filter', 'none');
        // });


};



// CHART FUNCTION
m.renderChart = function() {
    // DRAWING THE SVG
    var chartHolder = d3.select('#content-container');
    var boundingRect = chartHolder.node().getBoundingClientRect();
    var width = boundingRect.width;
    var rowHeight = 50;
    var lineLength = m.data.length*rowHeight; // 50px for each row height
    var height = lineLength;
    var cellWidth = (width-margin.left-margin.right)/12.0;
    var tooltip = d3.select('#content-tooltip');
    // var color = d3.interpolateRgb('white', '#FFEB3B'); // color interpolater for the table rows
    // var rowColor = function(d) {
    //     var numberEvents = d.values.length;
    //     return color((numberEvents-6)/5);
    // };
    var rowColor = d3.scaleOrdinal()
                        .domain([6, 7, 8, 9, 10])
                        .range(['white',"#ffffe5","#fff7bc","#fee391","#fec44f"]);


    var svg = chartHolder.append('svg')
                .attr('width', width)
                .attr('height', height);



    // time to render the table rows
    var rows = svg.selectAll('.table-row')
        .data(m.data);
    rows.enter()
        .append('g').classed('table-row', true)
        .attr('transform', function(d, i) { // set the positions of the rows
            var y = rowHeight*i;
            return 'translate(0,' + y + ')';
        })
        .style('opacity', 0)
        // .on('mouseover', function(d) {
        //     d3.select(this).select('rect')
        //         .attr('fill', '#F5F5F5');
        // })
        .on('mouseout', function(d) {
            d3.select(this).select('rect')
                .attr('fill', 'white');
        })
        // .on('mouseover', function(d) {
        //     d3.selectAll('.table-row')
        //         .attr('opacity', 0.3);
        //     d3.select(this)
        //         .attr('opacity', 1.0);
        // })
        // .on('mouseout', function(d) {
        //     d3.selectAll('.table-row')
        //         .attr('opacity', 1.0);
        // })
        .append('rect') // color of the rows
        .attr('width', width)
        .attr('height', rowHeight)
        .attr('fill', 'white');
        // .attr('fill', function(d) { return rowColor(d); });

    svg.selectAll('.table-row')
        .append('rect')
        .attr('width', margin.left)
        .attr('height', rowHeight)
        .attr('fill', function(d) { return rowColor(d.values.length); });
    svg.selectAll('.table-row')
        .append('text') // name of the player
        .attr('text-anchor', 'end')
        .attr('y', rowHeight/2+4)
        .attr('x', margin.left-20)
        .text(function(d) {
            return d.key;
        });

    svg.selectAll('.table-row')
        .transition().delay(function(d, i) {
            return i*100;
        })
        .style('opacity', 1.0);


    // render the nationality flags
    // svg.selectAll('.table-row').append('image')
    //     // .attr('width', '16px')
    //     .attr('height', '50px')                                    // JSON.parse(d.images.replace(/'/g, '"'))[0]
    //     .attr('xlink:href', function(d) { return 'images/' + JSON.parse(d.values[0].images.replace(/'/g, '"'))[1]; })
    //     .attr('xlink:href', function(d) { return 'images/full/' + d.values[0].nationality.toLowerCase() + '.svg'; })
    //     .attr('x', 0)
    //     .attr('y', 0);
    // time to render the circles
    var valveEventList = []; // create a list of valve events in chronological order
    VALVE_EVENTS.forEach(function(d) {
        valveEventList.push(d.event);
    });

    var rowCircles = svg.selectAll('.table-row').selectAll('circle')
                        .data(function(d) { return d.values; });
    rowCircles.enter()
                .append('circle')
                .attr('r', 7)
                .attr('cx', function(d) {
                    var i = valveEventList.indexOf(d.event);
                    return margin.left + cellWidth/2 + i*cellWidth;
                })
                .attr('cy', rowHeight/2)
                .attr('fill', function(d) {
                    if (d.placement in PLACEMENT_COLORS) {
                        return PLACEMENT_COLORS[d.placement];
                    }
                    else {
                        return 'rgba(192, 226, 244, 0.8)';
                    }
                })
                // .attr('stroke', function(d) {
                //     if (d.placement in PLACEMENT_COLORS) {
                //         return 'black';
                //     }
                //     else {
                //         return 'none';
                //     }
                // })
                .attr('stroke-width', 1.5)

                // tooltips
                .on('mouseover', function(d) {
                    var matrix = this.getScreenCTM()
                                    .translate(+this.getAttribute('cx'),
                                    +this.getAttribute('cy'));
                    var circle = d3.select(this);

                    // setting the values
                    tooltip.select('h2')
                            .text(d.placement);
                    // tooltip.select('p')
                    //         .text(d.team);
                    tooltip.select('img')
                            .attr('src', 'images/'+ d.images[0])
                            .attr('height', '50px')
                            .style('opacity', 1.0);

                            // .style('opacity', 0);
                    // img.transition()
                    //     .style('opacity', 1.0);
                    // setting the positions
                    var w = parseInt(tooltip.style('width'));
                    tooltip.style('left', (window.pageXOffset+matrix.e-w/2-10)+'px')
                            .style('top', (window.pageYOffset+matrix.f+15)+'px');


                    // light up the corresponding event header
                    d3.select('#'+strip(d.event))
                        .style('filter', 'url(#brightness)');
                        // .classed('brighten', true);
                    tooltip.transition()
                            .style('opacity', 1.0);
                })
                .on('mouseout', function(d) {
                    d3.select('#'+strip(d.event))
                        .style('filter', null);
                        // .classed('brighten', false);
                    // tooltip.select('img').transition()
                    //         .style('opacity', 0);
                    tooltip.transition()
                            .style('opacity', 0);
                });

    // drawing the lines
    // rest of the lines (horizontal)
    m.data.forEach(function(d, i) {
        svg.append('line')
            .attr('x1', 0)
            .attr('x2', width)
            .attr('y1', rowHeight*i)
            .attr('y2', rowHeight*i)
            .attr('stroke', '#9E9D24')
            // .attr('stroke', 'black')
            // .attr('opacity', 0.2)
            .attr('stroke-width', 0.3);
    });
    // the first line (vertical)
    svg.append('line')
        .attr('x1', margin.left)
        .attr('x2', margin.left)
        .attr('y1', 0)
        .attr('y2', lineLength)
        .attr('stroke', 'black')
        .attr('stroke-width', 4);
    // rest of the lines (vertical)
    // VALVE_EVENTS.forEach(function(d, i) {
    //     svg.append('line')
    //         .attr('x1', margin.left + (cellWidth*(i+1)))
    //         .attr('x2', margin.left + (cellWidth*(i+1)))
    //         .attr('y1', 0)
    //         .attr('y2', lineLength)
    //         .attr('stroke', 'black')
    //         .attr('opacity', 0.2)
    //         .attr('stroke-width', 2);
    // });

    // participation tally indicator
    // determine positions of the tally
    // var tally = d3.select('#tally')
    //     .style('left', (window.innerWidth - width)/2 + width - 40 + 'px')
    //     .style('top', '150px')
    //     .text('10');

    // d3.select('window').on('scroll', function() {
    //     console.log('scrolling!');
    //     var tableRows = svg.selectAll('.table-row');
    //     var scrollTop = window.scrollTop();
    //     console.log(scrollTop);
    //
    //     tableRows.each(function(d) {
    //         var row = d3.select(this);
    //         var rowTop = row.offset().top;
    //         if (rowTop - scrollTop === 0) {
    //             tally.text(d.values.length);
    //         }
    //     });
    // });
};



// RESIZE FUNCTION
// d3.select(window).on('resize', function() {
//     console.log('resizing!');
//     // Render header
//     m.renderHeader();
//     // Render chart
//     m.renderChart();
// });



}(window.m = window.m || {}));
