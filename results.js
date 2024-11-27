var map;
var markerLayer;
var wcaId = "2022ANDE01";
var data = {
    resource_id: "wcaID",
};

var data2 = {
    resource_id: "wcaCompID",
};

let competitionMap = new Map();

var map;

var championships = 0;

const compIcon = L.icon({
    iconUrl: 'images/comp-marker.svg',
    shadowUrl: 'images/marker-shadow.png',
    shadowAnchor: [13, 43],
    iconSize: [26, 40],
    iconAnchor: [13, 40],
    popupAnchor: [0, -40]
});

var methodArchitects = {
    "2015CHER07": "7Simul (Clock)",
    "2003POCH01": "Old Pochmann (BLD)",
    "2009YAUR01": "Yau Method (4x4x4-7x7x7)",
    "1982FRID01": "CFOP (3x3x3)",
    "2007STRO01": "Sarah's Skewb Method(s)",
    "2003VAND01": "Vandenbergh SQ1 Method",
    "2003ZBOR02": "ZZ Method (3x3x3)",
    "2004ROUX01": "Roux Method (3x3x3)",
    "2008LINT01": "Lin SQ-1 Method",
    "2008BODO01": "Balint (Megaminx)",
    "2008WEST02": "Westlund (Megaminx)",
    "2008YUDA01": "Yu Da-hyun (Megaminx)",
    "1982PETR01": "Petrus Method (3x3x3)",
    "2008JONG03": "Hoya Method (4x4x4 & 5x5x5)",
    "2003BRUC01": "ZB (3x3x3)"
}

var wcaFounders = {
    "2003BRUC01": "Founder",
    "2004MAOT02": "Founder"
}

$( document ).ready(function() {

    // Listen for the hash change event
    window.addEventListener('hashchange', function() {
        // Reload the page when the hash changes
        location.reload();
    });

    const resultsTab = document.querySelector('.resultsTab');
    const competitionsTab = document.querySelector('.competitionsTab');
    const recordsTab = document.querySelector('.recordsTab');
    const champsTab = document.querySelector('.champsTab');
    const mapTab = document.querySelector('.mapTab');

    const resultsPane = document.querySelector('.resultsPane');
    const competitionsPane = document.querySelector('.competitionsPane');
    const recordsPane = document.querySelector('.recordsPane');
    const championshipsPane = document.querySelector('.championshipsPane');
    const mapPane = document.querySelector('.mapPane');

    document.querySelector('#explainer').addEventListener('click', () => {

        document.querySelector('.badgesExplainer').style.display = "flex";

    });

    document.querySelector('#exitExplainer').addEventListener('click', () => {

        document.querySelector('.badgesExplainer').style.display = "none";

    });

    resultsTab.addEventListener('click', () => {

        resultsTab.classList.add('selectedTab');
        competitionsTab.classList.remove('selectedTab');
        recordsTab.classList.remove('selectedTab');
        champsTab.classList.remove('selectedTab');
        mapTab.classList.remove('selectedTab');

        resultsPane.classList.remove('hiddenPane');
        competitionsPane.classList.add('hiddenPane');
        recordsPane.classList.add('hiddenPane');
        championshipsPane.classList.add('hiddenPane');
        mapPane.classList.add('hiddenPane');
    });

    competitionsTab.addEventListener('click', () => {

        resultsTab.classList.remove('selectedTab');
        competitionsTab.classList.add('selectedTab');
        recordsTab.classList.remove('selectedTab');
        champsTab.classList.remove('selectedTab');
        mapTab.classList.remove('selectedTab');


        resultsPane.classList.add('hiddenPane');
        competitionsPane.classList.remove('hiddenPane');
        recordsPane.classList.add('hiddenPane');
        championshipsPane.classList.add('hiddenPane');
        mapPane.classList.add('hiddenPane');
    });
    
    recordsTab.addEventListener('click', () => {

        resultsTab.classList.remove('selectedTab');
        competitionsTab.classList.remove('selectedTab');
        recordsTab.classList.add('selectedTab');
        champsTab.classList.remove('selectedTab');
        mapTab.classList.remove('selectedTab');

        resultsPane.classList.add('hiddenPane');
        competitionsPane.classList.add('hiddenPane');
        recordsPane.classList.remove('hiddenPane');
        championshipsPane.classList.add('hiddenPane');
        mapPane.classList.add('hiddenPane');
    });
    
    champsTab.addEventListener('click', () => {

        resultsTab.classList.remove('selectedTab');
        competitionsTab.classList.remove('selectedTab');
        recordsTab.classList.remove('selectedTab');
        champsTab.classList.add('selectedTab');
        mapTab.classList.remove('selectedTab');

        resultsPane.classList.add('hiddenPane');
        competitionsPane.classList.add('hiddenPane');
        recordsPane.classList.add('hiddenPane');
        championshipsPane.classList.remove('hiddenPane');
        mapPane.classList.add('hiddenPane');
    });
    
    mapTab.addEventListener('click', () => {

        resultsTab.classList.remove('selectedTab');
        competitionsTab.classList.remove('selectedTab');
        recordsTab.classList.remove('selectedTab');
        champsTab.classList.remove('selectedTab');
        mapTab.classList.add('selectedTab');

        resultsPane.classList.add('hiddenPane');
        competitionsPane.classList.add('hiddenPane');
        recordsPane.classList.add('hiddenPane');
        championshipsPane.classList.add('hiddenPane');
        mapPane.classList.remove('hiddenPane');

    

    });
    
    if (window.location.hash) {
        hash = window.location.hash.substring(1);
        if (/^[0-9]{4}[A-Z]{4}[0-9]{2}$/.test(hash)){
            wcaId = hash;
        }
    }

    const searchBox = document.getElementById('searchBox');

    // Listen for the 'Enter' key press on the search box
    searchBox.addEventListener('keypress', function(event) {
        // Check if the 'Enter' key is pressed
        if (event.key === 'Enter') {
            // Prevent default behavior (form submission, if applicable)
            event.preventDefault();

            // Get the value from the search box
            const searchValue = searchBox.value;

            // Update the URL hash with the search value
            window.location.hash = searchValue.toUpperCase();
        }
    });

    $.ajax({
        url: `https://raw.githubusercontent.com/robiningelbrecht/wca-rest-api/master/api/persons/${wcaId}.json`,
        dataType: "json", 
        cache: true,
        success: function(data) {

            document.querySelector('.share').addEventListener('click', function() {
    
                navigator.clipboard.writeText(`https://ando527.github.io/wcaWireframes/results.html#${data.id}`)
                    .then(() => {
                        console.log('Text copied to clipboard');
                    })
                    .catch(err => {
                        console.error('Failed to copy text: ', err);
                    });
            });

            const eventOrder = [
                "333", "222", "444", "555", "666", "777", 
                "333bf", "333fm", "333oh", 
                "clock", "minx", "pyram", "skewb", "sq1", 
                "444bf", "555bf", "333mbf", "magic", "mmagic", "333mbo"
            ];

            loadCompetitionMap(data.competitionIds, function() {
                //console.log('Competition map after loading:', competitionMap);
        
                // Now you can use getCompetitionName to retrieve names
                showCompetitions(data);
                showResultsWithEventPicker(data);
                showChampionshipPodiums(data);

                
            

                if (!document.querySelector("#mapHolder").hasChildNodes()) {
                    map = initLeafletMap();
                    addCompetitionMarkers(map, data.competitionIds); // Add markers based on competition IDs
                }

                mapPane.classList.add('hiddenPane');
                
                // Function to reorder an array based on the defined event order
                function reorderArray(array) {
                    return array.sort((a, b) => {
                        return eventOrder.indexOf(a.eventId) - eventOrder.indexOf(b.eventId);
                    });
                }
                
                // Assuming `data.rank.averages` and `data.rank.singles` are the arrays to reorder
                data.rank.averages = reorderArray(data.rank.averages);
                data.rank.singles = reorderArray(data.rank.singles);

                //console.log(data);
                document.querySelector("#profileName").innerHTML = `<span class="flag ${data.country.toLowerCase()}"></span>${data.name}`;
                document.querySelector("#collapsedName").innerHTML = data.name;
                document.title = `${data.name} | WCA Prototype`;
                document.querySelector(".collapsedWcaId").innerHTML = data.id;
                document.querySelector(".wcaId").innerHTML = data.id;
                document.querySelector(".comps").innerHTML = data.numberOfCompetitions;
                document.querySelector(".solves").innerHTML = countTotalValidSolves(data);
                for (let result of data.rank.singles){
                    if (result.eventId != "magic" && result.eventId != "mmagic" && result.eventId != "333ft" && result.eventId != "333mbo"){
                        document.querySelector("#results").innerHTML += `
                        <tr class="resultRow-${result.eventId}"> 
                            <td class="icon"><img src="icons/${result.eventId}.svg"/></td>
                            <td class="event left">${getEventName(result.eventId)}</td>
                            <td class="nr right ${prettyRank(result.rank.country)}">${result.rank.country}</td>
                            <td class="cr right ${prettyRank(result.rank.continent)}">${result.rank.continent}</td>
                            <td class="wr right ${prettyRank(result.rank.world, 1)}">${result.rank.world}</td>
                            <td class="single right">${parseResult(result.eventId, result.best, true)}</td>
                        </tr>
                        `;
                    }
                }
                for (let result of data.rank.averages){
                    if (result.eventId != "magic" && result.eventId != "mmagic" && result.eventId != "333ft" && result.eventId != "333mbo"){
                        document.querySelector(`.resultRow-${result.eventId}`).innerHTML += `
                            <td class="average left">${parseResult(result.eventId, result.best, false)}</td>
                            <td class="wr left ${prettyRank(result.rank.world, 1)}">${result.rank.world}</td>
                            <td class="cr left ${prettyRank(result.rank.continent)}">${result.rank.continent}</td>
                            <td class="nr left ${prettyRank(result.rank.country)}">${result.rank.country}</td>
                        `;
                    }
                }

                const table = document.querySelector(".resultsTable");
                const expectedColCount = table.querySelector("thead tr").children.length; // Number of columns in the header
                //console.log(expectedColCount);

                table.querySelectorAll("#results tr").forEach(row => {
                    const cellCount = row.children.length;
                    //console.log(row);
                    if (cellCount < expectedColCount) {
                        const colspan = expectedColCount - cellCount + 1; // Calculate colspan for the missing columns
                        const emptyCell = document.createElement("td");
                        emptyCell.setAttribute("colspan", colspan);
                        emptyCell.innerHTML = ""; // Add blank content

                        row.appendChild(emptyCell); // Append the colspan cell to make the row full-width
                    }
                });

                if (data.medals.bronze == 0){
                    document.querySelector(".bronze").remove();
                } else {
                    document.querySelector(".bronzeMedals").innerHTML = data.medals.bronze;
                }

                if (data.medals.silver == 0){
                    document.querySelector(".silver").remove();
                } else {
                    document.querySelector(".silverMedals").innerHTML = data.medals.silver;
                }

                if (data.medals.gold == 0){
                    document.querySelector(".gold").remove();
                } else {
                    document.querySelector(".goldMedals").innerHTML = data.medals.gold;
                }

                career(data);
                medals(data);
                //methodArchitect(data);
                //wcaFounder(data);
                

                const champWins = champs(data.results, data.championshipIds);
                //console.log(champWins);
                if (champWins.wins > 0){
                    document.querySelector(".champsText").textContent = champWins.wins + " Championship Titles";
                } else if (champWins.podiums > 0){
                    document.querySelector(".champsText").textContent = champWins.podiums + " Championship Podiums";
                } else {
                    document.querySelector(".champs").remove();
                    championshipsPane.remove();
                    champsTab.remove();
                }

            });

            $.ajax({
                url: `https://www.worldcubeassociation.org/api/v0/persons/${data.id}`,
                method: "GET",
                success: function(response) {
                  const avatarUrl = response.person.avatar.url;
                  const thumbUrl = response.person.avatar.thumb_url;
                  console.log("Dataraw:", response);

                document.querySelector(".region").innerHTML = response.person.country.id;
                parseGender(response.person.gender);

                if (response.records.continental == 0){
                    document.querySelector(".continent").remove();
                } else {
                    document.querySelector(".continentalRecords").innerHTML = response.records.continental;
                }
                if (response.records.national == 0){
                    document.querySelector(".national").remove();
                } else {
                    document.querySelector(".nationalRecords").innerHTML = response.records.national;
                }
                if (response.records.world == 0){
                    document.querySelector(".world").remove();
                } else {
                    document.querySelector(".worldRecords").innerHTML = response.records.world;
                }


                if (response.records.world == 0 && response.records.continental == 0 && response.records.national == 0){
                    recordsPane.remove();
                    recordsTab.remove();
                }

                records(data, response);

                badges(response);

                  $('#profilePhoto').attr("src",avatarUrl);
                  $('#collapsedPhoto').attr("src",thumbUrl);
                  
                },
                error: function(error) {
                  console.error("Error fetching data:", error);
                }
              }).done(function() {
                document.querySelector("#profileHolder").style.opacity = '1';
                document.querySelector("#pageLoading").style.opacity = '0';
                adjustStickyHeight(); // Initial call on page load
        setImageMaxHeight();
                });


              
              


        }
    });


   

    
    //console.log(document.body.offsetWidth);

    if (document.body.offsetWidth > 1200){
        // Adjust height on scroll and on page load
        window.addEventListener("scroll", adjustStickyHeight);
        window.addEventListener("resize", adjustStickyHeight);
        adjustStickyHeight(); // Initial call on page load
        setImageMaxHeight();
    }

       // Manually preset an 18x8 array with probability values between 0 and 1
       const array = [
        [0.05, 0.1, 0.1, 0.15, 0.18, 0.2, 0.2, 0.25, 0.35, 0.35, 0.85, 0.9, 1, 1, 1, 1, 1, 1],
        [0.05, 0.1, 0.1, 0.15, 0.18, 0.2, 0.2, 0.25, 0.35, 0.35, 0.85, 0.9, 1, 1, 1, 1, 1, 1],
		[0.05, 0.1, 0.1, 0.15, 0.18, 0.2, 0.2, 0.25, 0.35, 0.35, 0.85, 0.9, 1, 1, 1, 1, 1, 1],
		[0.05, 0.1, 0.1, 0.15, 0.18, 0.2, 0.2, 0.25, 0.35, 0.35, 0.85, 0.9, 1, 1, 1, 1, 1, 1],
		[0.05, 0.1, 0.1, 0.15, 0.18, 0.2, 0.2, 0.25, 0.35, 0.35, 0.85, 0.9, 1, 1, 1, 1, 1, 1],
		[0.05, 0.1, 0.1, 0.15, 0.18, 0.2, 0.2, 0.25, 0.35, 0.35, 0.85, 0.9, 1, 1, 1, 1, 1, 1],
		[0.05, 0.1, 0.1, 0.15, 0.18, 0.2, 0.2, 0.25, 0.35, 0.35, 0.85, 0.9, 1, 1, 1, 1, 1, 1],
		[0.05, 0.1, 0.1, 0.15, 0.18, 0.2, 0.2, 0.25, 0.35, 0.35, 0.85, 0.9, 1, 1, 1, 1, 1, 1]
    ];

    // Color function based on the probability value
    function getColor(probValue) {
        if (probValue <= 1/6) return '#029347';      // 0.0 - 0.166
        if (probValue <= 2/6) return '#ff5800';   // 0.167 - 0.333
        if (probValue <= 3/6) return '#0051BA';   // 0.334 - 0.5
        if (probValue <= 4/6) return '#FFD313';    // 0.501 - 0.666
        if (probValue <= 5/6) return '#C62535';     // 0.667 - 0.833
        return '#FFFFFF';                         // 0.834 - 1
    }

    // Get the parent div
    const randomHolder = document.getElementById('randomHolder');

    // Loop through the array and add divs with respective colors
    array.forEach(row => {
        row.forEach(probValue => {
			let randomNumber = Math.random();
            const div = document.createElement('div');
            div.classList.add('random');
			if (randomNumber < probValue){
				div.style.backgroundColor = getColor(randomNumber/probValue);
			} else {
				div.style.backgroundColor = 'transparent';
			}
            randomHolder.appendChild(div);
        });
    });


});

function adjustStickyHeight() {
    let stickyElement = document.querySelector("#profileCard");
    let header = document.querySelector("#header");
    if (document.body.offsetWidth > 1200){
        const offset = 90; // Fixed offset from bottom
        const viewportHeight = window.innerHeight;
        const headerHeight = header.offsetHeight;
        const scrollPos = window.scrollY;

        // Calculate capped header offset
        const headerOffset = Math.max(0, headerHeight - scrollPos);
        
        // Set height dynamically
        stickyElement.style.height = `${viewportHeight - offset - headerOffset}px`;
        setImageMaxHeight();
    } else {
        stickyElement.style.height = "auto";
    }
}

function setImageMaxHeight() {
    // Get the heights of the specified elements
    const profileCardHeight = $('#profileCard').height();
    const achievementsHeight = $('#achievements').height();
    const profileDetailsHeight = $('#profileDetails').height();
    const profileNameHeight = $('#profileName').height();

    // Calculate the max height (combined heights minus 60px)
    const maxHeight = profileCardHeight - achievementsHeight - profileDetailsHeight - profileNameHeight - 30;

    // Apply the calculated max-height to the image
    $('#profilePhoto').css('max-height', maxHeight + 'px');
}

function countTotalValidSolves(data) {
    let totalSolveCount = 0;
    for (const compId of data.competitionIds) {
        const events = data.results[compId];
        if (events) {
            for (const eventId in events) {
                const rounds = events[eventId];
                rounds.forEach(round => {
                    if (round.solves && Array.isArray(round.solves)) {
                        round.solves.forEach(solve => {
                            if (solve !== -1 && solve !== -2 && solve !== 0) {
                                totalSolveCount++;
                            }
                        });
                    }
                });
            }
        }
    }
    return totalSolveCount;
}

function parseGender(genderChar){
    if (genderChar == "f"){
        document.querySelector(".gender").innerHTML = "Female";
    } else if (genderChar == "m"){
        document.querySelector(".gender").innerHTML = "Male";
    }
    else {
        document.querySelector(".genderData").remove();
    }

}

function prettyRank(result, world){
    if (parseInt(result) == 1){
        return "orange"
    } else if (parseInt(result) < 11){
        return "green"
    } else {
        if (world == 1){
            if (parseInt(result) < 26){
                return "green"
            }
        }
        return "";
    }
}

function parseResult(event, result, single){
    if (result == "-1"){
        return "DNF";
    }
    if (result == "-2"){
        return "DNS";
    }
    if (event == "333fm" && single){
        return result;
    } else if (event == "333mbf"){
        const resultStr = result.toString();
    
        // Check if the result starts with "1" for the old format
        const isOldFormat = resultStr.startsWith('1');

        if (isOldFormat) {
            // Old format decoding
            const SS = parseInt(resultStr.slice(1, 3));
            const AA = parseInt(resultStr.slice(3, 5));
            const TTTTT = parseInt(resultStr.slice(5));

            const solved = 99 - SS;
            const attempted = AA;
            const timeInSeconds = TTTTT === 99999 ? "Unknown" : TTTTT;
            //console.log("OLD");
            return `${solved}/${attempted} ${secToMin(timeInSeconds)}`;
        } else {
            // New format decoding
            const DD = parseInt(resultStr.slice(0, 2));
            const TTTTT = parseInt(resultStr.slice(2, 7));
            const MM = parseInt(resultStr.slice(7, 9));
            //console.log(DD, TTTTT, MM);
            const difference = 99 - DD;
            const missed = MM;
            const solved = difference + missed;
            const attempted = solved + missed;
            const timeInSeconds = TTTTT === 99999 ? "Unknown" : TTTTT;

            return `${solved}/${attempted} ${secToMin(timeInSeconds)}`;
        }
    }
    else {
        if (result > 5999) {
            let minutes = Math.floor(result / 6000);
            let seconds = (result % 6000) / 100;
            return `${minutes}:${seconds.toFixed(2).padStart(5, '0')}`; // Ensures two decimal places
        } 
        return (parseFloat(result).toFixed(2)/100).toFixed(2);
    }
}

function secToMin(seconds){
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const paddedSeconds = remainingSeconds.toString().padStart(2, '0');
    
    return `${minutes}:${paddedSeconds}`;
}

function career(data){
    let latestYear = 0;
    let careerLength = 0;

    Object.keys(data.results).forEach(id => {
        // Get the last 4 characters of the ID as a year
        const year = parseInt(id.slice(-4));
        
        // Update latestYear if this year is more recent
        if (year > latestYear) {
            latestYear = year;
        }
    });
    const idYear = data.id.slice(0, 4);

    careerLength = latestYear - idYear;
    if (careerLength == 0){
        document.querySelector(".careerText").innerHTML = "Newcomer";
    } else {
        document.querySelector(".careerText").innerHTML = careerLength + " Year Career";
    }
}

function medals(data){
    if (data.medals.gold > 0){
        document.querySelector(".medalsText").innerHTML = data.medals.gold + " Gold Medals";
    } else if (data.medals.silver > 0){
        document.querySelector(".medalsText").innerHTML = data.medals.silver + " Silver Medals";
    } else if (data.medals.bronze > 0){
        document.querySelector(".medalsText").innerHTML = data.medals.bronze + " Bronze Medals";
    } else {
        document.querySelector(".medalsHolder").remove();
        document.querySelector(".medals").remove();
    }
}

function records(data1, data){
    if (data1.rank.averages.some(event => event.rank && event.rank.world === 1) || data1.rank.singles.some(event => event.rank && event.rank.world === 1)){
        document.querySelector(".recordsText").innerHTML = "Current World Record Holder";
    } else {
        if (data.records.world > 0){
            document.querySelector(".recordsText").innerHTML = data.records.world + " Time World Record Holder";
        } else if (data.records.continental > 0){
            document.querySelector(".recordsText").innerHTML = data.records.continental + " Time Continental Record Holder";
        } else if (data.records.national > 0){
            document.querySelector(".recordsText").innerHTML = data.records.national + " Time National Record Holder";
        } else {
            document.querySelector(".recordsHolder").remove();
            document.querySelector(".records").remove();
            if (document.querySelector("#recordsAndMore").innerHTML == ""){
                document.querySelector("#recordsAndMore").remove();
            }
        }
    }
}

function methodArchitect(data){

    if (Object.keys(methodArchitects).includes(data.id)){
        document.querySelector(".method").innerHTML += `
        <span class="tooltip">${methodArchitects[data.id]}</span>
        `;
    } else {
        document.querySelector(".method").remove();
    }
}

function wcaFounder(data){
   
    if (Object.keys(wcaFounders).includes(data.id)){
        //do nothing
    } else {
        document.querySelector(".founder").remove();
    }
}


function champs(results, championshipIds) {
    let wins = 0;
    let podiums = 0;

    // Iterate through each championship ID
    championshipIds.forEach(championshipId => {
        if (results[championshipId]) {
            // Iterate over each event in the championship
            for (const event in results[championshipId]) {
                const rounds = results[championshipId][event];
                
                // Check for a round marked as "Final"
                rounds.forEach(round => {
                    if (round.round === "Final" && round.position) {
                        // Check if the position is 1, 2, or 3
                        if (round.position == 1) {
                            wins++;
                            podiums++;
                        } else if (round.position == 2 || round.position == 3) {
                            podiums++;
                        }
                    }
                });
            }
        }
    });
    championships = podiums;
    return { wins, podiums };
}

function badges(data){

    

    data.person.teams.forEach(team=> {
        let teamText = team.friendly_id.toUpperCase();
        let teamRole = "";
        let baseUrl = "greenBase.svg";
        let staffColour = "black";

        switch (teamText) {
            case "WEAT":
            case "WFC":
            case "WSOT":
                staffColour = "blue";
                break;
            
            case "WRT":
            case "WQAC":
            case "WCAT":
                staffColour = "yellow";
                break;
            
            case "WIC":
            case "WAC":
            case "WRC":
                staffColour = "orange";
                break;
            
            case "WST":
            case "WAT":
            case "WCT":
            case "WMT":
                staffColour = "green";
                break;
        
            case "BOARD":
                staffColour = "black";
                break;
        
            default:
                staffColour = "black"; // Fallback color class if none match
        }

        if (team.leader == true){
            teamRole = "LEADER";
            baseUrl = "blueBase.svg";
        } else {
            if (team.senior_member == true){
                teamRole = "SENIOR MEMBER";
                baseUrl = "orangeBase.svg";
            } else {
                teamRole = "MEMBER";
            }
        }
        document.querySelector('#staffRoles').innerHTML += `

            <div class="role ${staffColour}">
            <svg id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 88.44 89.99">
                <g id="Layer_1-2" data-name="Layer 1">
                    <path class="cls-1" d="m50.2.36L13.98,11.62c-2.73.85-4.8,3.09-5.43,5.88L.2,54.49c-.63,2.79.28,5.7,2.38,7.64l27.86,25.74c2.1,1.94,5.07,2.61,7.8,1.76l36.22-11.26c2.73-.85,4.8-3.09,5.43-5.88l8.36-37c.63-2.79-.28-5.7-2.38-7.64L58,2.12c-2.1-1.94-5.07-2.61-7.8-1.76Z"/>
                    <path class="cls-2" d="m20.53,21.64l23.53,21.33c.51.46,1.22.62,1.88.42l30.3-9.15c1.47-.44,1.87-2.31.73-3.33l-24.14-21.5c-.51-.46-1.23-.61-1.89-.41l-29.68,9.33c-1.44.46-1.85,2.3-.73,3.32h0Z"/>
                    <path class="cls-4" d="m40.58,79.9l30.52-9.44c.71-.22,1.25-.8,1.4-1.52l6.79-30.47c.34-1.54-1.1-2.88-2.61-2.42l-30.17,9.12c-.71.21-1.25.79-1.41,1.51l-7.13,30.8c-.36,1.55,1.1,2.91,2.61,2.44h0Z"/>
                    <path class="cls-3" d="m9.64,56.79l23.75,21.95c.91.85,2.4.39,2.68-.82l7.36-31.8c.13-.57-.06-1.17-.49-1.57l-24.1-21.84c-.92-.84-2.4-.37-2.67.86l-7.01,31.69c-.12.56.06,1.15.48,1.54Z"/>
                </g>
            </svg>

            <span>${teamText} ${teamRole}</span>
            </div>
        `;
    });

    if (data.person.delegate_status != null){
        let delegateText = data.person.delegate_status.toUpperCase().replace(/_/g, ' ').replace("DELEGATE", "");
        document.querySelector('#staffRoles').innerHTML += `

            <div class="role red">
            <svg id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 88.44 89.99">
                <g id="Layer_1-2" data-name="Layer 1">
                    <path class="cls-1" d="m50.2.36L13.98,11.62c-2.73.85-4.8,3.09-5.43,5.88L.2,54.49c-.63,2.79.28,5.7,2.38,7.64l27.86,25.74c2.1,1.94,5.07,2.61,7.8,1.76l36.22-11.26c2.73-.85,4.8-3.09,5.43-5.88l8.36-37c.63-2.79-.28-5.7-2.38-7.64L58,2.12c-2.1-1.94-5.07-2.61-7.8-1.76Z"/>
                    <path class="cls-2" d="m20.53,21.64l23.53,21.33c.51.46,1.22.62,1.88.42l30.3-9.15c1.47-.44,1.87-2.31.73-3.33l-24.14-21.5c-.51-.46-1.23-.61-1.89-.41l-29.68,9.33c-1.44.46-1.85,2.3-.73,3.32h0Z"/>
                    <path class="cls-4" d="m40.58,79.9l30.52-9.44c.71-.22,1.25-.8,1.4-1.52l6.79-30.47c.34-1.54-1.1-2.88-2.61-2.42l-30.17,9.12c-.71.21-1.25.79-1.41,1.51l-7.13,30.8c-.36,1.55,1.1,2.91,2.61,2.44h0Z"/>
                    <path class="cls-3" d="m9.64,56.79l23.75,21.95c.91.85,2.4.39,2.68-.82l7.36-31.8c.13-.57-.06-1.17-.49-1.57l-24.1-21.84c-.92-.84-2.4-.37-2.67.86l-7.01,31.69c-.12.56.06,1.15.48,1.54Z"/>
                </g>
            </svg>

            <span>${delegateText} DELEGATE</span>
            </div>
        `;
    };
    document.getElementById('staffRoles')?.innerHTML.trim() === '' && document.getElementById('staffRoles').remove();

}


function showCompetitions(data){




    if (document.querySelector(".competitionsPane").innerHTML == ""){
        let tableHTML = `<table><thead>
            <tr>
                <td class="eventNameRow"><img src="icons/event.svg" />Event</td>
                <td class="roundRow">Round</td>
                <td class="placeRow">Place</td>
                <td class="bestRow">Best</td>
                <td class="averageRow">Average</td>
                <td class="timeRow">1</td>
                <td class="timeRow">2</td>
                <td class="timeRow">3</td>
                <td class="timeRow">4</td>
                <td class="timeRow">5</td>
            </tr></thead><tbody>
        `;
        //console.log(data.results);
        // Iterate over each competition in the results
        for (let [competition, events] of Object.entries(data.results)) {
            // Insert competition name as a table header row
            tableHTML += `
                <tr class="competition-header">
                    <td colspan="10" class="compTitle">${getCompetitionName(competition)}</td>
                </tr>
            `;

            // Iterate over each event within the competition
            for (let [event, rounds] of Object.entries(events)) {
                let roundFirst = true
                for (let roundData of rounds) {
                    // Start a new row for each round
                    if (roundFirst){
                        tableHTML += `
                            <tr>
                                <td class="eventNameRow"><img src="icons/${event}.svg" />${getEventName(event)}</td>
                                <td class="roundRow">${roundData.round}</td>
                                <td class="placeRow">${roundData.position || ''}</td>
                                <td class="bestRow">${formatTime(roundData.best, (event === "333fm") ? 1 : 0)}</td>
                                <td class="averageRow">${formatTime(roundData.average)}</td>
                                <td class="timeRow">${roundData.solves.map(time => formatTime(time, (event === "333fm") ? 1 : 0)).join('</td><td class="timeRow">')}</td>
                            </tr>
                        `;
                        roundFirst = false;
                    } else {
                        tableHTML += `
                            <tr>
                                <td class="eventNameRow"></td>
                                <td class="roundRow">${roundData.round}</td>
                                <td class="placeRow">${roundData.position || ''}</td>
                                <td class="bestRow">${formatTime(roundData.best, (event === "333fm") ? 1 : 0)}</td>
                                <td class="averageRow">${formatTime(roundData.average)}</td>
                                <td class="timeRow">${roundData.solves.map(time => formatTime(time, (event === "333fm") ? 1 : 0)).join('</td><td class="timeRow">')}</td>
                            </tr>
                        `;
                    }
                    
                }
            }
        }

        // Close the table tags
        tableHTML += `</tbody></table>`;

        document.querySelector(".competitionsPane").innerHTML = tableHTML;


        
    }

    
}

function showResultsWithEventPicker(data) {

 // Create an event picker with icons at the top of the results pane
 if (document.querySelector(".resultsPane").innerHTML == "") {
    let eventPickerHTML = `<div class="eventPicker">`;
    const eventIcons = new Set();
    const eventOrder = [
        "333", "222", "444", "555", "666", "777", 
        "333bf", "333fm", "333oh", 
        "clock", "minx", "pyram", "skewb", "sq1", 
        "444bf", "555bf", "333mbf", "magic", "mmagic", "333mbo"
    ];
    for (let events of Object.values(data.results)) {
        for (let eventId of Object.keys(events)) {
            eventIcons.add(eventId);
        }
    }
    // Assuming eventIcons is a Set, convert it to an array first
    let eventIconsArray = Array.from(eventIcons);

    // Reorder eventIcons based on eventOrder array
    eventIconsArray.sort((a, b) => {
        // Get the index of each event in eventOrder array
        let indexA = eventOrder.indexOf(a);
        let indexB = eventOrder.indexOf(b);

        // If the event is not found in eventOrder, assign a high index to push it to the end
        if (indexA === -1) indexA = eventOrder.length;
        if (indexB === -1) indexB = eventOrder.length;

        return indexA - indexB;
    });
    eventIconsArray.forEach(event => {
        eventPickerHTML += `<img class="eventIcon" src="icons/${event}.svg" data-event="${event}" title="${getEventName(event)}" />`;
    });
    eventPickerHTML += `</div>`;

    // Create the initial table structure
    let tableHTML = `<table class="filteredResultsTable"><thead>
        <!-- Event header row will be dynamically inserted here -->
        <tr>
            <td class="roundRow">Round</td>
            <td class="placeRow">Place</td>
            <td class="bestRow">Best</td>
            <td class="averageRow">Average</td>
            <td class="timeRow">1</td>
            <td class="timeRow">2</td>
            <td class="timeRow">3</td>
            <td class="timeRow">4</td>
            <td class="timeRow">5</td>
        </tr></thead><tbody></tbody></table>`;

    // Insert the event picker and table into the resultsPane
    document.querySelector(".resultsPane").innerHTML = eventPickerHTML + tableHTML;

    // Store all results in a map for easy filtering
    let allResults = [];

    for (let [competition, events] of Object.entries(data.results)) {
        for (let [event, rounds] of Object.entries(events)) {
            rounds.forEach(roundData => {
                allResults.push({
                    competition,
                    event,
                    roundData
                });
            });
        }
    }

    // Function to display filtered results with single competition header
    function displayResults(filteredResults, event) {
        let filteredTableHTML = ``;
        let lastCompetition = null;

        // Insert event header row
        let eventHeaderHTML = `
            <tr class="event-header">
                <td colspan="10">
                    <img src="icons/${event}.svg" /> ${getEventName(event)}
                </td>
            </tr>
        `;
        document.querySelector(".filteredResultsTable thead").insertAdjacentHTML('afterbegin', eventHeaderHTML);

        // Iterate through filtered results and generate rows
        filteredResults.forEach(result => {
            const { competition, roundData } = result;

            // Add competition header only if it's different from the last one
            if (competition !== lastCompetition) {
                filteredTableHTML += `
                    <tr class="competition-header">
                        <td colspan="10" class="compTitle">${getCompetitionName(competition)}</td>
                    </tr>
                `;
                lastCompetition = competition;
            }

            filteredTableHTML += `
                <tr>
                    <td class="roundRow">${roundData.round}</td>
                    <td class="placeRow">${roundData.position || ''}</td>
                    <td class="bestRow">${formatTime(roundData.best, (event === "333fm") ? 1 : 0)}</td>
                    <td class="averageRow">${formatTime(roundData.average)}</td>
                    <td class="timeRow">${roundData.solves.map(time => formatTime(time, (event === "333fm") ? 1 : 0)).join('</td><td class="timeRow">')}</td>
                </tr>
            `;
        });

        document.querySelector(".filteredResultsTable tbody").innerHTML = filteredTableHTML;

                    // Get the table with class "filteredResultsTable"
            const table = document.querySelector('table.filteredResultsTable');

            if (table) {
            // Get all <td> elements with the class "averageRow" within the table
            const averageRows = Array.from(table.querySelectorAll('td.averageRow'));

            // Start tracking the lowest time (initialize with a large value)
            let lowestTime = Infinity;

            // Iterate from the bottom up
            for (let i = averageRows.length - 1; i >= 0; i--) {
                // Parse the time value from the cell (convert to a number)
                const currentTime = parseFloat(averageRows[i].textContent.trim());

                // Check if the current time is the lowest seen so far
                if (currentTime < lowestTime) {
                // Update the lowest time
                lowestTime = currentTime;

                // Add the 'pr' class to the current element
                averageRows[i].classList.add('pr');
                }
            }

            // Get all <td> elements with the class "averageRow" within the table
            const bestRows = Array.from(table.querySelectorAll('td.bestRow'));

            // Start tracking the lowest time (initialize with a large value)
            let lowestBestTime = Infinity;

            // Iterate from the bottom up
            for (let i = bestRows.length - 1; i >= 0; i--) {
                // Parse the time value from the cell (convert to a number)
                const currentTime = parseFloat(bestRows[i].textContent.trim());

                // Check if the current time is the lowest seen so far
                if (currentTime < lowestBestTime) {
                // Update the lowest time
                lowestBestTime = currentTime;

                // Add the 'pr' class to the current element
                bestRows[i].classList.add('pr');
                }
            }


            // Get all <td> elements with the class "timeRow" within the table
            const timeRows = Array.from(table.querySelectorAll('td.timeRow'));

            // Start tracking the lowest time (initialize with a large value)
            let lowestTimeTime = Infinity;

            // Iterate from the bottom up
            for (let i = timeRows.length - 1; i >= 0; i--) {
                const cell = timeRows[i];

                // Skip if the cell is inside a <th> (header row)
                if (cell.closest('thead')) {
                continue;
                }

                // Get the current row of the cell
                const currentRow = cell.closest('tr');

                // Parse the time value from the cell (convert to a number)
                const currentTime = parseFloat(cell.textContent.trim());

                // Check if this time is the lowest time seen so far
                if (currentTime < lowestTimeTime) {
                // Update the lowest time
                lowestTimeTime = currentTime;

                // Remove any existing 'pr' class in the same row (just in case)
                Array.from(currentRow.querySelectorAll('.pr')).forEach(prCell => {
                    if (prCell.closest('.timeRow')) { // Check if the element is within a .timeRow
                        prCell.classList.remove('pr');
                    }
                });
                

                // Add the 'pr' class to the current cell
                cell.classList.add('pr');
                }
            }

            }




    }

    // Initially filter by the 3x3x3 Cube event (event ID "333")

    const defaultEvent = eventIcons.has('333') ? '333' : [...eventIcons][0];
    const defaultResults = allResults.filter(result => result.event === defaultEvent);
    document.querySelector('.eventIcon').classList.add('selectedIcon');
    displayResults(defaultResults, defaultEvent);

    // Add event listener for event icons
    document.querySelectorAll('.eventIcon').forEach(icon => {
        icon.addEventListener('click', function () {
            const selectedEvent = this.getAttribute('data-event');

            document.querySelectorAll('.eventIcon').forEach(icon => {
                icon.classList.remove('selectedIcon');
            });
            this.classList.add('selectedIcon');
            const filteredResults = allResults.filter(result => result.event === selectedEvent);

            // Clear the event header before inserting a new one
            document.querySelector(".filteredResultsTable thead").innerHTML = `
                <tr>
                    <td class="roundRow">Round</td>
                    <td class="placeRow">Place</td>
                    <td class="bestRow">Best</td>
                    <td class="averageRow">Average</td>
                    <td class="timeRow">1</td>
                    <td class="timeRow">2</td>
                    <td class="timeRow">3</td>
                    <td class="timeRow">4</td>
                    <td class="timeRow">5</td>
                </tr>
            `;

            displayResults(filteredResults, selectedEvent);
        });
    });
}
}

function showChampionshipPodiums(data) {
    // Hide other panes and show the championshipsPane

    // Check if the championshipsPane has been filled already
   // Check if the championshipsPane has been filled already
   if (document.querySelector(".championshipsPane").innerHTML == "") {
    let tableHTML = `<table class="championshipPodiumsTable"><thead>
        <tr>
            <td class="eventNameRow"><img src="icons/event.svg" />Event</td>
            <td class="roundRow">Round</td>
            <td class="placeRow">Place</td>
            <td class="bestRow">Best</td>
            <td class="averageRow">Average</td>
            <td class="timeRow">1</td>
            <td class="timeRow">2</td>
            <td class="timeRow">3</td>
            <td class="timeRow">4</td>
            <td class="timeRow">5</td>
        </tr></thead><tbody>
    `;

    // Extract the list of championship IDs from the data object
    const championshipIds = new Set(data.championshipIds);

    // Filter results for final rounds and positions 1, 2, or 3 in championships only
    for (let [competition, events] of Object.entries(data.results)) {
        if (!championshipIds.has(competition)) continue; // Skip if not a championship

        let competitionHasPodium = false;

        for (let [event, rounds] of Object.entries(events)) {
            rounds.forEach(roundData => {
                if (roundData.round.toLowerCase() == "final" && roundData.position && roundData.position <= 3) {
                    if (!competitionHasPodium) {
                        // Add competition name as a table header row (only once per competition)
                        tableHTML += `
                            <tr class="competition-header">
                                <td colspan="10" class="compTitle">${getCompetitionName(competition)}</td>
                            </tr>
                        `;
                        competitionHasPodium = true; // Ensure competition name appears only once
                    }

                    // Add podium finish data
                    tableHTML += `
                        <tr>
                            <td class="eventNameRow"><img src="icons/${event}.svg" />${getEventName(event)}</td>
                            <td class="roundRow">${roundData.round}</td>
                            <td class="placeRow">${roundData.position || ''}</td>
                            <td class="bestRow">${formatTime(roundData.best, (event === "333fm") ? 1 : 0)}</td>
                            <td class="averageRow">${formatTime(roundData.average, (event === "333fm") ? 1 : 0)}</td>
                            <td class="timeRow">${roundData.solves.map(time => formatTime(time, (event === "333fm") ? 1 : 0)).join('</td><td class="timeRow">')}</td>
                        </tr>
                    `;
                }
            });
        }
    }

    // Close the table tags
    tableHTML += `</tbody></table>`;

    // Add the generated table into the championshipsPane
    document.querySelector(".championshipsPane").innerHTML = tableHTML;
}
}


function getEventName(eventCode) {
    const eventNames = {
        "222": "2x2x2 Cube",
        "333": "3x3x3 Cube",
        "444": "4x4x4 Cube",
        "555": "5x5x5 Cube",
        "666": "6x6x6 Cube",
        "777": "7x7x7 Cube",
        "333bf": "3x3x3 Blindfolded",
        "333fm": "3x3x3 Fewest Moves",
        "333oh": "3x3x3 One-Handed",
        "333ft": "3x3x3 With Feet",
        "clock": "Clock",
        "minx": "Megaminx",
        "pyram": "Pyraminx",
        "skewb": "Skewb",
        "sq1": "Square-1",
        "444bf": "4x4x4 Blindfolded",
        "555bf": "5x5x5 Blindfolded",
        "333mbf": "3x3x3 Multi-Blind",
        "magic": "Magic",
        "mmagic": "Master Magic"
    };
    return eventNames[eventCode] || eventCode;
}

function formatTime(time, fmc = 0) {
    if (time === -1) return "DNF";
    if (time === -2) return "DNS";
    if (time === 0) return "";

    if (fmc == 1){
        return time;
    }

    if (time.toString().length >8 ){
        return parseResult( "333mbf", time,  true);
    }
    if (time > 5999) {
        let minutes = Math.floor(time / 6000);
        let seconds = (time % 6000) / 100;
        return `${minutes}:${seconds.toFixed(2).padStart(5, '0')}`; // Ensures two decimal places
    } 
    return (time / 100).toFixed(2); // Assuming time is in centiseconds, convert to seconds
}

function loadCompetitionMap(competitionIds, callback) {
    const baseUrl = 'https://raw.githubusercontent.com/robiningelbrecht/wca-rest-api/master/api/competitions/';
    let requestsRemaining = competitionIds.length;

    competitionIds.forEach(competitionId => {
        const url = `${baseUrl}${competitionId}.json`;

        $.ajax({
            url: url,
            method: 'GET',
            dataType: "json", 
            success: function(data) {
                if (data.id && data.name) {
                    // Store the competition ID and name in the map
                    competitionMap.set(data.id, data.name);
                }
            },
            error: function(xhr, status, error) {
                console.error(`Failed to fetch data from ${url}:`, error);
            },
            complete: function() {
                requestsRemaining--;
                if (requestsRemaining === 0) {
                    callback(); // Call the callback when all requests are done
                }
            }
        });
    });
}

// Function to get competition name by ID from the map
function getCompetitionName(competitionId) {
    return competitionMap.get(competitionId) || competitionId; // Fallback to the ID if name not found
}

function initLeafletMap() {
    // Create the Leaflet map and center it on a default location
    const map = L.map('mapHolder').setView([20, 0], 2); // Center at lat 20, lon 0, zoom level 2

    // Set the tile layer for the map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    return map; // Return the map object to add markers later
}

// Function to add markers to the map
function addCompetitionMarkers(map, competitionIds) {
    const baseUrl = 'https://raw.githubusercontent.com/robiningelbrecht/wca-rest-api/master/api/competitions/';

    competitionIds.forEach(competitionId => {
        const url = `${baseUrl}${competitionId}.json`;

        $.ajax({
            url: url,
            method: 'GET',
            dataType: 'json', // Expect JSON response
            success: function(data) {
                //console.log(data);
                if (data &&  data.venue.coordinates) {
                    const lat = data.venue.coordinates.latitude;
                    const lon = data.venue.coordinates.longitude;

                    // Create a marker for the competition location
                    const marker = L.marker([lat, lon], {
                        icon: compIcon}).addTo(map);
                    marker.bindPopup(`<strong>${data.name}</strong><br>${data.city}, ${data.country}`);
                } else {
                    console.error(`Missing coordinates or details for ${competitionId}`);
                }
            },
            error: function(xhr, status, error) {
                console.error(`Failed to fetch data for ${competitionId}:`, error);
            }
        });
    });
}

