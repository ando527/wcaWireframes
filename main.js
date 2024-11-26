var infoPane;
var allFutureComps = [];
var compsToDraw = [];
var lastClicked;
var map;
var markerLayer;
var locationLayer;
var squareLayer;
var eventsToFilter = [];
var userX;
var userY;
var startDate;
var endDate;

var twinComps = [];

var distance = 0;
var locationWorks = false;

var currentCountry = "";
var currentContinent = "";

var displayingMap = false;

var radioButtons;

const champIcon = L.icon({
    iconUrl: 'images/champ-marker.svg',
    shadowUrl: 'images/marker-shadow.png',
    shadowAnchor: [13, 43],
    iconSize: [26, 40],
    iconAnchor: [13, 40],
    popupAnchor: [0, 0]
});

const compIcon = L.icon({
    iconUrl: 'images/comp-marker.svg',
    shadowUrl: 'images/marker-shadow.png',
    shadowAnchor: [13, 43],
    iconSize: [26, 40],
    iconAnchor: [13, 40],
    popupAnchor: [0, 0]
});

const locationIcon = L.icon({
    iconUrl: 'icons/location.svg',
    iconSize: [25, 25],
    iconAnchor: [12, 12],
    popupAnchor: [0, 0]
});

const eventMap = {
    "222": "2x2x2 Cube",
    "333": "3x3x3 Cube",
    "333bf": "3x3x3 Blindfolded",
    "333mbf": "3x3x3 Multi-Blind",
    "333fm": "3x3x3 Fewest Moves",
    "333oh": "3x3x3 One-Handed",
    "444": "4x4x4 Cube",
    "444bf": "4x4x4 Blindfolded",
    "555": "5x5x5 Cube",
    "555bf": "5x5x5 Blindfolded",
    "666": "6x6x6 Cube",
    "777": "7x7x7 Cube",
    "clock": "Clock",
    "minx": "Megaminx",
    "pyram": "Pyraminx",
    "skewb": "Skewb",
    "sq1": "Square-1"
};



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
    //allFutureComps.sort((a, b) => new Date(a.date.from) - new Date(b.date.from));

    // Sort competitions by start date (ascending)
    allFutureComps.sort((a, b) => {
        const startDateA = new Date(a.date.from);
        const startDateB = new Date(b.date.from);

        // If the start dates are the same, sort by end date (date.to)
        if (startDateA.getTime() === startDateB.getTime()) {
            const endDateA = new Date(a.date.till);
            const endDateB = new Date(b.date.till);
            return endDateA - endDateB;
        }

        // Otherwise, sort by start date (date.from)
        return startDateA - startDateB;
    });


    // Filter out competitions that are in the past
    allFutureComps = allFutureComps.filter(comp => new Date(comp.date.from) >= today);

    allFutureComps = groupCloseCompetitionsByLocation(allFutureComps);

    compsToDraw = allFutureComps;
    loadMap();
    addRows(allFutureComps);
    document.querySelector("#mapPane").style.display = "none";
    document.querySelector("#compTable").style.display = "flex";
    countComps();
    document.getElementById('country').addEventListener('change', function() {
        handleCountryChange(this.value);
    });
    document.getElementById('mapButton').addEventListener('click', function() {
        mapToggle();
    });
    document.getElementById('listButton').addEventListener('click', function() {
        listToggle();
    });
    document.getElementById('clearFilters').addEventListener('click', function() {
        clearFilters();
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
        console.log(selectedContinent);
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

        
        //currentContinent = selectedContinent;

        handleContinentChange(selectedContinent);
    });

    const startDatePicker = document.getElementById('startDate');
    const endDatePicker = document.getElementById('endDate');

    // Event listener for the start date picker
    startDatePicker.addEventListener('change', function() {
        startDate = startDatePicker.value;
        handleDateChange();
    });

    // Event listener for the end date picker
    endDatePicker.addEventListener('change', function() {
        endDate = endDatePicker.value;
        handleDateChange();
    });

    radioButtons = document.querySelectorAll('input[name="distance"]');
    radioButtons.forEach(function(radioButton) {
        radioButton.addEventListener('change', handleDistanceRadioChange);
    });

    document.querySelector("#filterLocation").addEventListener('click', function() {
        filterLocation();
    });
    
    document.querySelector("#exitNewcomer").addEventListener('click', function() {
        closeNewcomer();
    });

    document.querySelector("#advancedFiltersToggle").addEventListener('click', function() {
        openCloseAdvanced();
    });

}

function openCloseAdvanced() {
    const dropdown = document.querySelector("#advancedDropDownContent");
    if (dropdown.style.maxHeight === "0px" || dropdown.style.maxHeight === "") {
        // Get the scrollHeight (total height of the content)
        dropdown.style.maxHeight = dropdown.scrollHeight + "px"; // Set max-height to content's height
        document.querySelector("#filterArrow").classList.add("flipped");
    } else {
        dropdown.style.maxHeight = "0px"; // Collapse
        document.querySelector("#filterArrow").classList.remove("flipped");
    }
}

function mapToggle(){
    if (!displayingMap){
        refreshMarkers(compsToDraw);
        document.querySelector("#mapPane").style.display = "block";
        document.querySelector("#compTable").style.display = "none";
        document.querySelector("#listButton").classList.remove('selectedMode');
        document.querySelector("#mapButton").classList.add('selectedMode');
        displayingMap = true;
    }
    countComps();
}

function listToggle(){
    if (displayingMap){
        clearTable();
        addRows(compsToDraw);
        document.querySelector("#mapPane").style.display = "none";
        document.querySelector("#compTable").style.display = "flex";
        document.querySelector("#listButton").classList.add('selectedMode');
        document.querySelector("#mapButton").classList.remove('selectedMode');
        displayingMap = false;
    }
    countComps();
}

function distanceToCompCalc(coordinates){
    let distanceTo = (111 * Math.sqrt((coordinates.latitude-userX)*(coordinates.latitude-userX)+(coordinates.longitude-userY)*(coordinates.longitude-userY))).toFixed(0);
    if (distanceTo > 1){
        return distanceTo;
    } else {
        return "<0"
    }
}

function countComps(){
    if (displayingMap || compsToDraw.length < 100){
        document.querySelector("#displayingCount").innerHTML = "Currently Displaying: " + compsToDraw.length + " comps";
    } else {
        document.querySelector("#displayingCount").innerHTML = "Currently Displaying: 100 comps";
    }
}

function compDistance(coordinates){
    if (locationWorks){
        let distanceToComp = distanceToCompCalc(coordinates);
        return `
            <tr>
                <td class="infoIconsHolder">
                    <img src="icons/distance.svg" class="infoIcon" />
                </td>
                <td>
                    ${distanceToComp}km away
                </td>
            </tr>
        `
    } else {
        return "";
    }
}

function groupCloseCompetitionsByLocation(comps) {
    let result = [];

    // Loop through the competitions
    for (let i = 0; i < comps.length; i++) {
        const currentComp = comps[i];
        const currentDate = new Date(currentComp.date.from);
        
        // Add current competition to the result list
        result.push(currentComp);

        // Check subsequent competitions for matching location and close date
        for (let j = i + 1; j < comps.length; j++) {
            const nextComp = comps[j];
            const nextDate = new Date(nextComp.date.from);

            const dayDifference = Math.abs((nextDate - currentDate) / (1000 * 60 * 60 * 24));

            // If the location is the same and the date is within 2 days
            if (currentComp.venue.address === nextComp.venue.address && dayDifference <= 2 && (currentComp.name.toLowerCase().indexOf("fmc") === -1 && nextComp.name.toLowerCase().indexOf("fmc") === -1) ) {
                // Move the next competition to directly after the current competition
                result.push(nextComp);
                twinComps.push([currentComp.id, nextComp.id]);
                // Remove the moved competition from the main list (to avoid duplicate entries)
                comps.splice(j, 1);

                // Adjust the index as we removed one element
                j--;
            }
        }
    }

    return result;
}



function filterLocation(){
    navigator.geolocation.getCurrentPosition(
        (position) => {
            L.marker([position.coords.latitude, position.coords.longitude], { icon: locationIcon }).addTo(locationLayer);
            userX = position.coords.latitude;
            userY = position.coords.longitude;
            locationWorks = true;
            radioButtons.forEach(function(radioButton) {
                radioButton.disabled = false;
                if (radioButton.value == "close"){
                    radioButton.checked = true;
                    distance = 10;
                    drawSquare();
                    collateFilters();
                    if (displayingMap){
                        refreshMarkers(compsToDraw);
                    } else {
                        clearTable();
                        addRows(compsToDraw);
                    }
                }
            });
            document.querySelector("#filterLocation").style.display = "none";
            document.querySelector("#successLocation").style.display = "block";

        }, 
        (error) => {
            console.error('Error getting location:', error.message);

            alert('Unable to retrieve your location. Please ensure location services are enabled.');

        }

    );
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

function closeNewcomer(){
    document.querySelector("#newcomer").style.display = "none";
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

function handleContinentChange(continentCode){
    currentContinent = continentCode;
    collateFilters();
    if (displayingMap){
        refreshMarkers(compsToDraw);
    } else {
        clearTable();
        addRows(compsToDraw);
    }
}

function handleDateChange(){
    collateFilters();
    if (displayingMap){
        refreshMarkers(compsToDraw);
    } else {
        clearTable();
        addRows(compsToDraw);
    }
}

function handleDistanceRadioChange(event) {
    const selectedValue = event.target.getAttribute('data-name'); // Get the custom data-name attribute
    
    switch(selectedValue){
        case 'closest':
            distance = 5;
            drawSquare();
            break;
        case 'close':
            distance = 10;
            drawSquare();
            break;
        case 'far':
            distance = 15;
            drawSquare();
            break;
        case 'furthest':
            distance = 25;
            drawSquare();
            break;
        case 'all':
            distance = 0;
            drawSquare();
            break;
        default:
            distance = 0;
            drawSquare();
            break;
    }
    collateFilters();
    if (displayingMap){
        refreshMarkers(compsToDraw);
    } else {
        clearTable();
        addRows(compsToDraw);
    }
}

function drawSquare(){
    if (distance == 0){
        squareLayer.clearLayers();
    } else {
        var latlngs = [
            [userX - distance, userY - distance],  // Bottom-left
            [userX - distance, userY + distance],  // Bottom-right
            [userX + distance, userY + distance],  // Top-right
            [userX + distance, userY - distance]   // Top-left
        ];
        radiusCircle = 1000 * (distance * 95)
        squareLayer.clearLayers();
        /*var squarePolygon = */
        //L.polygon(latlngs, {color: '#C1E6CD'}).addTo(squareLayer);
        L.circle([userX, userY], {radius: radiusCircle, color: '#C1E6CD'}).addTo(squareLayer);
        //markerLayer.addLayer(square);
    }
}

function approximateDistance(lat1, lon1, lat2, lon2) {
    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;
    return dLat * dLat + dLon * dLon; // Return the squared distance
}


function collateFilters(){
    if (startDate || endDate){
        if(startDate){
            compsToDraw = allFutureComps.filter(comp => new Date(comp.date.from) >= new Date(startDate));
        }
        if (endDate){
            compsToDraw = allFutureComps.filter(comp => new Date(comp.date.from) <= new Date(endDate));
        }   
    } else {
        compsToDraw = allFutureComps;
    }
    if (distance > 0 && locationWorks) {
        const distanceSquared = distance * distance; // Square the distance for comparison
        
        compsToDraw = compsToDraw.filter(comp => {
            const compLatitude = comp.venue.coordinates.latitude;
            const compLongitude = comp.venue.coordinates.longitude;
    
            // Calculate the approximate squared distance
            const compDistanceSquared = approximateDistance(userX, userY, compLatitude, compLongitude);
    
            // Check if the competition is within the specified radius (compare squared distances)
            return compDistanceSquared <= distanceSquared;
        });
    }
    if (currentCountry == ""){
        if (currentContinent == ""){
            compsToDraw = compsToDraw.filter(comp => 
                eventsToFilter.every(event => comp.events.includes(event))
            );
        } else{
            console.log(currentContinent);
            compsToDraw = compsToDraw.filter(comp => countryCodeToContinent[comp.country] === currentContinent);
        }
    } else {
        compsToDraw = compsToDraw.filter(comp => comp.country === currentCountry);
    }

    if (eventsToFilter.length > 0){
        compsToDraw = compsToDraw.filter(comp => 
            eventsToFilter.every(event => comp.events.includes(event))
        );
    }
    countComps();
    
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
    locationLayer = L.layerGroup().addTo(map);
    squareLayer = L.layerGroup().addTo(map);
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
        });
    });
}

function refreshMarkers(drawTheseComps){
    markerLayer.clearLayers();
    drawTheseComps.forEach(function(competition) {
        if (competition.name.includes("Championship") || competition.name.includes("Nationals")){
            var marker = L.marker([competition.venue.coordinates.latitude, competition.venue.coordinates.longitude], {
                compId: competition.id,
                icon: champIcon
            }).addTo(markerLayer);
        } else {
            var marker = L.marker([competition.venue.coordinates.latitude, competition.venue.coordinates.longitude], {
                compId: competition.id,
                icon: compIcon
            }).addTo(markerLayer);
        }
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
    locationLayer.setZIndex(1000);
}

function addRows(drawTheseComps){
    var competitionTable = document.querySelector("#compTBody");
    if (drawTheseComps.length > 0){
        drawTheseComps.slice(0, 100).forEach(function(competition, index) {
            let oddOrEven = index % 2 === 0 ? "evenRow" : "oddRow";
            var championship=""
            if (competition.name.includes("Championship") || competition.name.includes("Nationals")){
                if (competition.name.includes("African") || competition.name.includes("Asian") || competition.name.includes("European") || competition.name.includes("American") || competition.name.includes("Oceanic")){
                    championship = `
                        <span><img src="icons/championship.svg" class="championshipIcon"/>Continental Championship<br /></span>
                    `;
                } else if (competition.name.includes("National")){
                    championship = `
                        <span><img src="icons/championship.svg" class="championshipIcon"/>National Championship<br /></span>
                    `;
                } else {
                    championship = `
                        <span><img src="icons/championship.svg" class="championshipIcon"/>Championship<br /></span>
                    `;
                }
                oddOrEven = "championshipRow";
            } 
            
            competitionTable.innerHTML += `
            <tr id="comp${competition.id}" class="compRow ${oddOrEven} ${((twinComps.some(pair => pair.includes(competition.id))) ? "twinComp": "")}" data-compid="${competition.id}">
                <td class="status">
                    <img src="icons/${randomIcon()}.svg" width="18px" height="18px"/>
                </td>
                <td class="date"><span>${formatCompetitionDates(competition.date.from, competition.date.till)}</span></td>
                <td class="name">${championship}<a href="/competition.html#${competition.id}" class="arrowLink">${truncateString(competition.name)}</a></td>
                <td class="locationAndRegion">
                    <span class="location">${competition.city}</span>
                    <span class="region">${countryCodeMapping[competition.country] || competition.country}</span>
                </td>
                <td class="flag ${competition.country.toLowerCase()}"></td>
                <td class="info"></td>
            </tr>
            ${displayEventsTable(competition.events, oddOrEven, competition)}
            `; 
        });

        
        let compRows = document.querySelectorAll('.compRow');
            compRows.forEach(function(row) {
                row.addEventListener('click', function() {
                    let elementId = row.dataset.compid; 
                    handleRowClick(elementId); 
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

function randomIcon(){
    
    let randomNum = Math.random();

    if (randomNum < 0.25) {
        return "regoFull";
    } else if (randomNum < 0.5) {
        return "closed";
    } else if (randomNum < 0.9) {
        return "open";
    } else {
        return "notOpenYet";
    }
}


function truncateString(str) {
    if (str.length > 32) {
        return str.slice(0, 24) + "..." + str.slice(-5);
    }
    return str; // If the string is less than or equal to 32 characters, return it as is
}

function clearFilters(){
    document.querySelectorAll('.toggle-checkbox').forEach(function(checkbox) {
        checkbox.checked = false;
    });
    document.querySelector("#continent").value="";
    document.querySelector("#country").value="";

    radioButtons = document.querySelectorAll('input[name="distance"]');
    radioButtons.forEach(function(radioButton) {
        if (radioButton.value = 'all'){
            radioButton.checked = true;
            distance = 0;
        }
    });
    squareLayer.clearLayers();
    document.getElementById('startDate').value = '';
    document.getElementById('endDate').value = '';
    startDate = "";
    endDate = "";

    collateFilters();
    if (displayingMap){
        refreshMarkers(compsToDraw);
    } else {
        clearTable();
        addRows(compsToDraw);
    }
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
    var championshipIconOrNot = "";
    if (competition.name.includes("Championship") || competition.name.includes("Nationals")){
        championshipIconOrNot = "<img src=\"icons/championship.svg\" class=\"compIcon\" />";
    }
    infoPane.innerHTML = `
            <h2>${championshipIconOrNot} ${competition.name}</h2>
            
            <table>
                <tbody>
                    <tr>
                        <td class="infoIconsHolder">
                            <div class="flagHolderPane"><div class="flag ${competition.country.toLowerCase()}"></div>
                        </td>
                        <td>
                            <b>${countryCodeMapping[competition.country] || competition.country}</b> &nbsp; ${competition.city}
                        </td>
                    </tr>
                    <tr>
                        <td class="infoIconsHolder">
                            <img src="icons/calendar.svg" class="infoIcon" />
                        </td>
                        <td>
                            ${formatCompetitionDates(competition.date.from, competition.date.till)}
                        </td>
                    </tr>

                     <tr>
                        <td class="infoIconsHolder">
                            <img src="icons/competitors.svg" class="infoIcon" />
                        </td>
                        <td>
                            285 Competitor Limit
                        </td>
                    </tr>

                     <tr>
                        <td class="infoIconsHolder">
                            <img src="icons/register.svg" class="infoIcon" />
                        </td>
                        <td>
                            43 Spots left
                        </td>
                    </tr>

                    <tr>
                        <td class="infoIconsHolder">
                            <img src="icons/venue.svg" class="infoIcon" />
                        </td>
                        <td>
                        ${createLinkFromString(competition.venue.name)}
                        </td>
                    </tr>
                    ${compDistance(competition.venue.coordinates)}
                </tbody>
            </table>
            <br />
            <span>Events:</span>
            <div class="eventsListPane">${displayEventsPane(competition.events)}</div>
            <br />
            <div id="infoPaneButtons">
                <a class="button-secondary" href="#">Register Now</a>
                <a class="button" href="/competition.html#${competition.id}">View Competition</a>
            </div>
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
            <img class="indivEventPane" src="icons/${event}.svg" title="${eventMap[event] || event}" />
        `;
    });
    return eventStringBuilder;
}

function displayEventsTable(events, oddOrEven, competition){
    if (oddOrEven == "championshipRow"){
        oddOrEven = "championshipRow championshipEvents";
    }
    let eventStringBuilder = `<tr class="eventRow ${oddOrEven} ${((twinComps.some(pair => pair.includes(competition.id))) ? "twinComp": "")}" style="display: ${displayEventsCheck()};"><td></td><td></td><td class="eventsTitleRow">Events:</td><td>`;
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
