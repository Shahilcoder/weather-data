let count = 0, ID = 0, ID2 = 0;

document.addEventListener('DOMContentLoaded', () => {
    ID = setInterval(loadCity, 3000);
    ID2 = setInterval(updateWeather, 1000);
});


function addCity() {
    // instantiate xmlhttp object
    // https://www.w3schools.com/xml/xml_http.asp
    var request;
    if (window.XMLHttpRequest) {
        // code for modern browsers
        request = new XMLHttpRequest();
     } else {
        // code for old IE browsers
        request = new ActiveXObject("Microsoft.XMLHTTP");
    }

    request.open('POST', '/');
    request.onload = () => {
        var response = request.responseText;
        
        // check valid response
        if (request.status == 200) {
            if (response != "none") {
                // parse to json
                var rjson = JSON.parse(response);

                // Add row to the weather table, such that other rows inputs do not reset
                // https://www.viralpatel.net/dynamically-add-remove-rows-in-html-table-using-javascript/
                var weatherTable = document.getElementById('weather-body');
                var rowCount = weatherTable.rows.length;
                var row = weatherTable.insertRow(rowCount);

                var cell1 = row.insertCell(0);
                var id = rjson["id"];
                cell1.innerText = id;

                var cell2 = row.insertCell(1);
                var name = rjson["name"];
                cell2.innerText = name;
                var cell3 = row.insertCell(2);
                var temp = parseInt((parseFloat(rjson["main"]["temp"]) - 273.15)*(parseFloat(9/5)) + 32);
                cell3.innerText = temp;
                var cell4 = row.insertCell(3);
                element1 = document.createElement('input');
                element1.value = 'F';
                cell4.appendChild(element1);
                var cell5 = row.insertCell(4);
                element2 = document.createElement('input');
                element2.value = '0';
                cell5.appendChild(element2);

            } else {
                return false;
            }
        } else {
            return false;
        }
    };
    formData = new FormData(document.querySelector('form'));
    request.send(formData);

    return false;
}


function loadCity() {
    // instantiate xmlhttp object
    // https://www.w3schools.com/xml/xml_http.asp
    var request;
    if (window.XMLHttpRequest) {
        // code for modern browsers
        request = new XMLHttpRequest();
     } else {
        // code for old IE browsers
        request = new ActiveXObject("Microsoft.XMLHTTP");
    }

    // send the request
    request.open('GET', `/city/${count}`);
    request.onload = () => {
        var response = request.responseText;
        
        // check valid response
        if (request.status == 200) {
            if (response != "none") {
                // parse to json
                var rjson = JSON.parse(response);

                // add row to the city table
                for (let i=0, n=rjson["cities"].length; i<n; ++i) {
                    let id = rjson["cities"][i]["id"];
                    let name = rjson["cities"][i]["name"];
                    let country = rjson["cities"][i]["country"];
                    
                    let tr = `\n<tr><td>${id}</td>\n<td>${name}</td>\n<td>${country}</td></tr>`;
                    document.getElementById('city-body').innerHTML += tr;
                }

                count += 20;
            } else {
                count = 0;
                clearInterval(ID);
            }
        } else {
            clearInterval(ID);
        }

    };
    request.send();
}


function updateWeather() {
    // instantiate xmlhttp object
    // https://www.w3schools.com/xml/xml_http.asp
    var requests = [];

    // send the request for each row in the table
    var rows = document.getElementById('weather-body').children;

    for (let i=0, n=rows.length; i<n; ++i) {
        var request;
        if (window.XMLHttpRequest) {
            // code for modern browsers
            request = new XMLHttpRequest();
         } else {
            // code for old IE browsers
            request = new ActiveXObject("Microsoft.XMLHTTP");
        }

        requests.push(request);
        if (parseInt(rows[i].children[4].children[0].value)) {
            // console.log("yes update");
            
            requests[i].open('GET', `/weather/${rows[i].children[0].innerText}`);
            requests[i].onload = () => {
                var response = requests[i].responseText;
                
                // check valid response
                if (requests[i].status == 200) {
                    if (response != "none") {
                        // parse to json
                        var rjson = JSON.parse(response);

                        // update the row
                        if (rows[i].children[3].children[0].value == "C") {
                            rows[i].children[2].innerHTML = parseInt(parseFloat(rjson["temp"]) - 273.15);
                            // console.log("yes, C");
                        } else {
                            rows[i].children[2].innerHTML = parseInt((parseFloat(rjson["temp"]) - 273.15)*(parseFloat(9/5)) + 32);
                            // console.log("yes, F");
                        }

                    }

                    else {
                        console.log("none");
                    }

                } else {
                    console.log("404 error");
                }
            };
            requests[i].send();
        } else {
            // console.log("No, not update");
            continue;
        }
    }
}