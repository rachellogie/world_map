$(document).ready(function () {

  var colors = [
    ['#ffd5ea', '#ff0e87'],
    ['#C7FFF5', '#026E5A'],
    ['#FFD1A8', '#7D3C027']
  ];

  var my_data = {
  };

  var counter = 0;

  function make_map(map_data, choice) {
    choice = choice || 'no data';
    var color1 = colors[counter % colors.length][0];
    var color2 = colors[counter % colors.length][1];
    console.log(color1);

    $('.world-map').vectorMap({
      map: 'world_mill_en',
      series: {
        regions: [
          {
            values: map_data,
            scale: [color1, color2],
            normalizeFunction: 'polynomial'
          }
        ]
      },
      onRegionLabelShow: function (e, el, code) {
        el.html(el.html() + ' (' + choice + ' - ' + map_data[code] + ')');
      }
    });
    counter++;
  }

  make_map(my_data);


  //when the show map button is clicked, populate the map
  $('.show_map_button').on('click', function (event) {
    event.preventDefault();

    //get the option out of the dropdown
    var choice = $('.drop_down option:selected').text()
    var api_request = get_api_request(choice);


    //to solve the world bank api issue with jQuery vs jquery
    $.ajaxSetup({
      beforeSend: function (xhr, settings) {
        var prefix = settings.url.match(/prefix=(.*?)&/);
        if (prefix.length > 1) {
          var callback = prefix[1];
          if (callback !== callback.toLowerCase()) {
            window[callback.toLowerCase()] =
              new Function("response", callback + "(response)");
          }
        }
      }
    });

    var ajax = $.ajax({
      url: api_request,
      method: 'GET',
      crossDomain: true,
      dataType: 'jsonp',
      jsonp: 'prefix'
    });

    ajax.fail(function (jqXHR, textStatus) {
      alert("Request failed: " + textStatus);
    });

    ajax.done(function (data) {
      data[1].forEach(function (name) {
        var countryId = name['country']['id'];
        var value = parseInt(name['value']);
        //only if the country has a value
        if (!isNaN(value)) {
          my_data[countryId] = value;
        }
      });

      $('.world-map').empty();

      make_map(my_data, choice);
    });


  });


  function get_api_request(choice) {
    if (choice == 'GDP per capita') {
      return "http://api.worldbank.org/countries/indicators/NY.GDP.PCAP.CD/?date=2010:2010&per_page=300&format=jsonP&prefix=?"
    } else if (choice == 'Population') {
      return "http://api.worldbank.org/countries/all/indicators/SP.POP.TOTL?date=2010:2010&per_page=300&format=jsonP&prefix=?"
    }
  }

});