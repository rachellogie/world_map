$(document).ready(function () {

  var colors = [
    {'#ffd5ea': '#ff0e87'}
  ];

  var map_data = {
  };

  var counter = 0;

  function make_map(map_data, choice) {
    choice = choice || 'no data';
    $('.world-map').vectorMap({
      map: 'world_mill_en',
      series: {
        regions: [
          {
            values: map_data,
//            scale: [Object.keys(colors[counter]), Object.values(colors[counter])],
            scale: ['#ffd5ea', '#ff0e87'],
            normalizeFunction: 'polynomial'
          }
        ]
      },
      onRegionLabelShow: function (e, el, code) {
        el.html(el.html() + ' (' + choice + ' - ' + map_data[code] + ')');
      }
    });
    counter ++;
  }

  make_map(map_data);


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
        if(!isNaN(value)){
          map_data[countryId] = value;
        }
      });
      $('#map-wrapper').append(make_map(map_data, choice));
    });


  });


  function get_api_request(choice) {
    if (choice == 'GDP per capita') {
      return "http://api.worldbank.org/countries/indicators/NY.GDP.PCAP.CD/?date=2010:2010&per_page=300&format=jsonP&prefix=?"
    } else if(choice == 'Population'){
        return "http://api.worldbank.org/countries/all/indicators/SP.POP.TOTL?date=2010:2010&per_page=300&format=jsonP&prefix=?"
    }
  }

});