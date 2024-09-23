var infoPane;
var allFutureComps = [];
var compsToDraw = [];
var lastClicked;
var map;
var markerLayer;
var eventsToFilter = [];

var currentCountry = "";

var displayingMap = false;

fetch('https://raw.githubusercontent.com/robiningelbrecht/wca-rest-api/master/api/competitions.json')
.then(response => response.json()) // Parse the JSON response
.then(data => {
    allFutureComps.push(...data.items)
    orderAndTruncate();
})
.catch(error => {
    console.error('Error fetching competitions:', error); // Handle any errors
});




function orderAndTruncate(){
    const today = new Date(); // Get today's date
    // Sort competitions by date (ascending)
    allFutureComps.sort((a, b) => new Date(a.date.from) - new Date(b.date.from));
    // Filter out competitions that are in the past
    allFutureComps = allFutureComps.filter(comp => new Date(comp.date.from) >= today);
    compsToDraw = allFutureComps;
    loadMap();
    addRows(allFutureComps);
    document.querySelector("#mapPane").style.display = "none";
    document.querySelector("#compTable").style.display = "flex";
    document.getElementById('country').addEventListener('change', function() {
        handleCountryChange(this.value);
    });
    document.getElementById('mapButton').addEventListener('click', function() {
        mapToggle(this);
    });

    // Add event listener to all checkboxes with the class 'toggle-checkbox'
    document.querySelectorAll('.toggle-checkbox').forEach(function(checkbox) {
        checkbox.addEventListener('click', function() {
            handleToggleClick(this);
        });
    });    

    document.getElementById('continent').addEventListener('change', function() {
        // Get the selected continent value
        var selectedContinent = this.value;
    
        // Get all the country options
        var countryOptions = document.querySelectorAll('#country option');
    
        // Loop through all the options in the country dropdown
        countryOptions.forEach(function(option) {
            // Get the continent of the current option from the dataset property
            var optionContinent = option.dataset.continent;
    
            // Show or hide the option based on whether it matches the selected continent
            if (selectedContinent === '' || optionContinent === selectedContinent || option.value === '') {
                option.hidden = false;  // Show option
            } else {
                option.hidden = true;   // Hide option
            }
        });
    });

    
}

function mapToggle(button){
    if (displayingMap){
        button.innerHTML = "Map View";
        clearTable();
        addRows(compsToDraw);
        document.querySelector("#mapPane").style.display = "none";
        document.querySelector("#compTable").style.display = "flex";
        displayingMap = false;
    } else {
        button.innerHTML = "List View";
        refreshMarkers(compsToDraw);
        document.querySelector("#mapPane").style.display = "block";
        document.querySelector("#compTable").style.display = "none";
        displayingMap = true;
    }
}

// The function to handle toggle clicks
function handleToggleClick(checkbox) {
    // Access the custom data-event attribute
    const eventName = checkbox.getAttribute('data-event');
    if (checkbox.checked){
        addStringToArray(eventsToFilter, eventName);
    } else {
        removeStringFromArray(eventsToFilter, eventName);
    }
    collateFilters();
    
    if (displayingMap){
        refreshMarkers(compsToDraw);
    } else {
        clearTable();
        addRows(compsToDraw);
    }

}

// Function to add a string to the array, if it doesn't already exist
function addStringToArray(arr, str) {
    if (!arr.includes(str)) {
        arr.push(str);
    }
}

// Function to remove a string from the array, if it exists
function removeStringFromArray(arr, str) {
    const index = arr.indexOf(str);
    if (index !== -1) {
        arr.splice(index, 1);
    }
}

function handleCountryChange(countryCode) {
    currentCountry = countryCode;
    collateFilters();
    if (displayingMap){
        refreshMarkers(compsToDraw);
    } else {
        clearTable();
        addRows(compsToDraw);
    }
}

function collateFilters(){
    if (currentCountry == ""){
        compsToDraw = allFutureComps.filter(comp => 
            eventsToFilter.every(event => comp.events.includes(event))
        );
    } else {
        compsToDraw = allFutureComps.filter(comp => comp.country === currentCountry);
    }

    if (eventsToFilter.length > 0){
        compsToDraw = compsToDraw.filter(comp => 
            eventsToFilter.every(event => comp.events.includes(event))
        );
    }
    
}

function clearTable(){
    document.querySelector("#compTBody").innerHTML = "";
}

function loadMap(){
    clearTable();
    map = L.map('mapPane').setView([15, 0], 2);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 10,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    markerLayer = L.layerGroup().addTo(map);
    compsToDraw.forEach(function(competition) {
        var marker = L.marker([competition.venue.coordinates.latitude, competition.venue.coordinates.longitude], {
            compId: competition.id
        }).addTo(markerLayer);
        marker.on('click', function(e){
            let competition = allFutureComps.find(comp => comp.id === e.target.options.compId);
            if (competition) {
                updateInfoPane(competition);
            } else {
                console.log("Competition not found error.");
            }
        });``
    });
}

function refreshMarkers(drawTheseComps){
    markerLayer.clearLayers();
    drawTheseComps.forEach(function(competition) {
        var marker = L.marker([competition.venue.coordinates.latitude, competition.venue.coordinates.longitude], {
            compId: competition.id
        }).addTo(markerLayer);
        marker.on('click', function(e){
            let competition = allFutureComps.find(comp => comp.id === e.target.options.compId);
            if (competition) {
                updateInfoPane(competition);
            } else {
                console.log("Competition not found error.");
            }
        });
    });
    if(markerLayer.getLayers().length === 0){
        map.setView([15, 0], 2);
    } else {
        var bounds = L.latLngBounds();  // `extend` will be called on this object

        // Iterate over each layer (marker) in the layer group and extend the bounds
        markerLayer.eachLayer(function(layer) {
        if (layer instanceof L.Marker) {  // Check if the layer is a marker
            bounds.extend(layer.getLatLng()); // Extend the bounds to include the marker's LatLng
        }
        });
            // Add a buffer to the bounds
        var southWest = bounds.getSouthWest();
        var northEast = bounds.getNorthEast();

        // Create new bounds with buffer (5 lat and 5 long points)
        var newBounds = L.latLngBounds(
        [southWest.lat - 5, southWest.lng - 5], // SouthWest with buffer
        [northEast.lat + 5, northEast.lng + 5]  // NorthEast with buffer
        );
        map.fitBounds(newBounds);
}
}

function addRows(drawTheseComps){
    var competitionTable = document.querySelector("#compTBody");
    if (drawTheseComps.length > 0){
        drawTheseComps.slice(0, 100).forEach(function(competition) {
            competitionTable.innerHTML += `
            <tr id="comp${competition.id}" class="compRow" data-compid="${competition.id}">
                <td class="status">
                    <img src="icons/closed.svg" width="18px" height="18px"/>
                </td>
                <td class="date"><span>${formatCompetitionDates(competition.date.from, competition.date.till)}</span></td>
                <td class="name"><a href="#" class="arrowLink">${truncateString(competition.name)}</a></td>
                <td class="locationAndRegion">
                    <span class="location">${competition.city}</span>
                    <span class="region">${countryCodeMapping[competition.country] || competition.country}</span>
                </td>
                <td class="flag ${competition.country.toLowerCase()}"></td>
                <td class="info"></td>
            </tr>
            ${displayEventsTable(competition.events)}
            `; 
        });

                    // Get all elements with the class 'compRow'
        let compRows = document.querySelectorAll('.compRow');
            compRows.forEach(function(row) {
                row.addEventListener('click', function() {
                    let elementId = row.dataset.compid; // Get the id of the clicked element
                    handleRowClick(elementId); // Call your function and pass the id
            });
        });
    } else {
        competitionTable.innerHTML = `
            <p>No competitions to display</p>
        `;
    }

    document.getElementById('showEvents').addEventListener('change', function() {
        // Get all rows with class 'eventRow'
        let eventRows = document.querySelectorAll('.eventRow');
    
        // Check if the checkbox is checked
        if (this.checked) {
            // If checked, display all event rows
            eventRows.forEach(function(row) {
                row.style.display = 'table-row';
            });
        } else {
            // If unchecked, hide all event rows
            eventRows.forEach(function(row) {
                row.style.display = 'none';
            });
        }
    });
    

}

function truncateString(str) {
    if (str.length > 32) {
        return str.slice(0, 24) + "..." + str.slice(-5);
    }
    return str; // If the string is less than or equal to 32 characters, return it as is
}



// Function that gets called on click, with the id as a parameter
function handleRowClick(id) {

    let competition = allFutureComps.find(comp => comp.id === id);
    if (lastClicked){
        lastClicked.classList.remove("highlightedRow");
    }
    lastClicked = document.querySelector("#comp" + id);
    lastClicked.classList.add("highlightedRow");
    if (competition) {
        updateInfoPane(competition);
    } else {
        console.log("Competition not found error.");
    }
}

function updateInfoPane(competition){
    infoPane = document.querySelector("#infoPane");
    infoPane.innerHTML = `
            <h1>${competition.name}</h1>
            <div class="flagHolderPane"><div class="flag ${competition.country.toLowerCase()}"></div><p>${countryCodeMapping[competition.country] || competition.country}</p></div>
            <p>${competition.city}</p>
            <p>${formatCompetitionDates(competition.date.from, competition.date.till)}</p>
            <p>${createLinkFromString(competition.venue.name)}</p>
            <div class="eventsListPane">${displayEventsPane(competition.events)}</div>
            <div class="button">View Competition</div>
            <div class="button">Register Now</div>
        `;
}



function formatCompetitionDates(fromDate, toDate) {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    const from = new Date(fromDate);
    const to = new Date(toDate);

    // If from and to dates are the same
    if (from.toDateString() === to.toDateString()) {
        return from.toLocaleDateString('en-US', options);
    }

    // If dates are in the same year and month
    if (from.getFullYear() === to.getFullYear() && from.getMonth() === to.getMonth()) {
        const fromDay = from.toLocaleDateString('en-US', { day: 'numeric' });
        const toDay = to.toLocaleDateString('en-US', { day: 'numeric' });
        const month = from.toLocaleDateString('en-US', { month: 'short' });
        const year = from.getFullYear();
        return `${month} ${fromDay} - ${toDay}, ${year}`;
    }

    // If dates are in the same year but different months
    if (from.getFullYear() === to.getFullYear()) {
        const fromFormat = from.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const toFormat = to.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const year = from.getFullYear();
        return `${fromFormat} - ${toFormat}, ${year}`;
    }

    // If dates are in different years
    const fromFormat = from.toLocaleDateString('en-US', options);
    const toFormat = to.toLocaleDateString('en-US', options);
    return `${fromFormat} - ${toFormat}`;
}

function createLinkFromString(str) {
    // Regular expression to match the format [text](url)
    const regex = /\[(.*?)\]\((.*?)\)/;
    const match = str.match(regex);

    // If a match is found, return the <a> tag
    if (match) {
        const linkText = match[1]; // Text inside the square brackets []
        const url = match[2]; // URL inside the parentheses ()
        return `<a href="${url}" target="_blank">${linkText}</a>`;
    }
    
    // If no match, return the original string
    return str;
}

function displayEventsPane(events){
    let eventStringBuilder = "";
    events.forEach(function(event) {
        eventStringBuilder += `
            <img class="indivEventPane" src="icons/${event}.svg"" />
        `;
    });
    return eventStringBuilder;
}

function displayEventsTable(events){
    let eventStringBuilder = `<tr class="eventRow" style="display: ${displayEventsCheck()};"><td></td><td></td><td class="eventsTitleRow">Events:</td><td>`;
    events.forEach(function(event) {
        eventStringBuilder += `
            <img class="indivEventRow" src="icons/${event}.svg"" />
        `;
    });
    eventStringBuilder += "</td><td></td><td></td></tr>";
    return eventStringBuilder;
}

function displayEventsCheck(){
    if (document.getElementById('showEvents').checked){
        return 'table-row';
    } else {
        return 'none';
    }
}
