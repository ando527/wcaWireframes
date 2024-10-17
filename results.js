var map;
var markerLayer;
var wcaId = "2022ANDE01";
var data = {
    resource_id: "wcaID",
};

var data2 = {
    resource_id: "wcaCompID",
};

$( document ).ready(function() {


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

    resultsTab.addEventListener('click', () => {
        console.log('Results tab clicked');

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
        console.log('Competitions tab clicked');

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
        console.log('Records tab clicked');

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
        console.log('Championship Podiums tab clicked');

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
        console.log('Map tab clicked');

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

    $.ajax({
        url: `https://raw.githubusercontent.com/robiningelbrecht/wca-rest-api/master/api/persons/${wcaId}.json`,
        dataType: "json", 
        cache: true,
        success: function(data) {

            const eventOrder = [
                "333", "222", "444", "555", "666", "777", 
                "333bf", "333fm", "333oh", 
                "clock", "minx", "pyram", "skewb", "sq1", 
                "444bf", "555bf", "333mbf"
            ];
            
            // Function to reorder an array based on the defined event order
            function reorderArray(array) {
                return array.sort((a, b) => {
                    return eventOrder.indexOf(a.eventId) - eventOrder.indexOf(b.eventId);
                });
            }
            
            // Assuming `data.rank.averages` and `data.rank.singles` are the arrays to reorder
            data.rank.averages = reorderArray(data.rank.averages);
            data.rank.singles = reorderArray(data.rank.singles);

            console.log(data);
            document.querySelector("#profileName").innerHTML = data.name;
            document.querySelector(".wcaId").innerHTML = data.id;
            document.querySelector(".comps").innerHTML = data.numberOfCompetitions;
            document.querySelector(".solves").innerHTML = countTotalValidSolves(data);
            for (let result of data.rank.singles){
                document.querySelector("#results").innerHTML += `
                <tr class="resultRow-${result.eventId}"> 
                    <td class="icon"><img src="icons/${result.eventId}.svg"/></td>
                    <td class="event left">${getEventName(result.eventId)}</td>
                    <td class="nr right ${prettyRank(result.rank.country)}">${result.rank.country}</td>
                    <td class="cr right ${prettyRank(result.rank.continent)}">${result.rank.continent}</td>
                    <td class="wr right ${prettyRank(result.rank.world)}">${result.rank.world}</td>
                    <td class="single right">${parseResult(result.eventId, result.best, true)}</td>
                </tr>
                `;
            }
            for (let result of data.rank.averages){
                document.querySelector(`.resultRow-${result.eventId}`).innerHTML += `
                    <td class="average left">${parseResult(result.eventId, result.best, true)}</td>
                    <td class="wr left ${prettyRank(result.rank.world)}">${result.rank.world}</td>
                    <td class="cr left ${prettyRank(result.rank.continent)}">${result.rank.continent}</td>
                    <td class="nr left ${prettyRank(result.rank.country)}">${result.rank.country}</td>
                `;
            }

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
            showCompetitions(data);

            const champWins = champs(data.results, data.championshipIds);
            console.log(champWins);
            if (champWins.wins > 0){
                document.querySelector(".champs").innerHTML = champWins.wins + " Championship Titles";
            } else if (champWins.podiums > 0){
                document.querySelector(".champs").innerHTML = champWins.podiums + " Championship Podiums";
            } else {
                document.querySelector(".champs").remove();
            }

            $.ajax({
                url: `https://www.worldcubeassociation.org/api/v0/persons/${data.id}`,
                method: "GET",
                success: function(response) {
                  const avatarUrl = response.person.avatar.url;
                  console.log("Dataraw:", response);

                document.querySelector(".region").innerHTML = response.person.country.name;
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

                records(data, response);

                badges(response);

                  $('#profilePhoto').attr("src",avatarUrl);
                },
                error: function(error) {
                  console.error("Error fetching data:", error);
                }
              });
        }
    });


    const stickyElement = document.querySelector("#profileCard");
    const header = document.querySelector("#header");

    function adjustStickyHeight() {
        const offset = 120; // Fixed offset from bottom
        const viewportHeight = window.innerHeight;
        const headerHeight = header.offsetHeight;
        const scrollPos = window.scrollY;

        // Calculate capped header offset
        const headerOffset = Math.max(0, headerHeight - scrollPos);
        
        // Set height dynamically
        stickyElement.style.height = `${viewportHeight - offset - headerOffset}px`;
    }

    // Adjust height on scroll and on page load
    window.addEventListener("scroll", adjustStickyHeight);
    window.addEventListener("resize", adjustStickyHeight);
    adjustStickyHeight(); // Initial call on page load



});

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

function prettyRank(result){
    if (parseInt(result) == 1){
        return "orange"
    } else if (parseInt(result) < 11){
        return "green"
    } else {
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
        document.querySelector(".career").innerHTML = "Newcomer";
    } else {
        document.querySelector(".career").innerHTML = careerLength + " Year Career";
    }
}

function medals(data){
    if (data.medals.gold > 0){
        document.querySelector(".medals").innerHTML = data.medals.gold + " Gold Medals";
    } else if (data.medals.silver > 0){
        document.querySelector(".medals").innerHTML = data.medals.silver + " Silver Medals";
    } else if (data.medals.bronze > 0){
        document.querySelector(".medals").innerHTML = data.medals.bronze + " Bronze Medals";
    } else {
        document.querySelector(".medalsHolder").remove();
        document.querySelector(".medals").remove();
    }
}

function records(data1, data){
    if (data1.rank.averages.some(event => event.rank && event.rank.world === 1) || data1.rank.singles.some(event => event.rank && event.rank.world === 1)){
        document.querySelector(".records").innerHTML = "Current World Record Holder";
    } else {
        if (data.records.world > 0){
            document.querySelector(".records").innerHTML = data.records.world + " time World Record Holder";
        } else if (data.records.continental > 0){
            document.querySelector(".records").innerHTML = data.records.continental + " time Continental Record Holder";
        } else if (data.records.national > 0){
            document.querySelector(".records").innerHTML = data.records.national + " time National Record Holder";
        } else {
            document.querySelector(".recordsHolder").remove();
            document.querySelector(".records").remove();
        }
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

    return { wins, podiums };
}

function badges(data){

    

    data.person.teams.forEach(team=> {
        let teamText = team.friendly_id.toUpperCase();
        let baseUrl = "greenBase.svg";
        if (team.leader == true){
            teamText += " LEADER";
            baseUrl = "blueBase.svg";
        } else {
            if (team.senior_member == true){
                teamText += " SENIOR MEMBER";
                baseUrl = "orangeBase.svg";
            } else {
                teamText += " MEMBER";
            }
        }

        document.querySelector(".leftTopContent").innerHTML = `
        <div class="emblem">
                        <img src="icons/${baseUrl}" alt="Emblem Base" class="emblem-base">
                        <svg viewBox="0 0 120 120" class="text-svg">
                            <defs>
                                <path id="circlePath" d="M 60, 60 m -46, 0 a 46,46 0 1,1 92,0 a 46,46 0 1,1 -92,0" />
                            </defs>
                            <text font-size="12" font-weight="bold" fill="white" letter-spacing="1.1">
                              <textPath href="#circlePath" startOffset="50%" text-anchor="middle">
                                ${teamText}
                              </textPath>
                            </text>
                          </svg>
                      </div>
        ` + document.querySelector(".leftTopContent").innerHTML;
    });

    if (data.person.delegate_status != null){
        let delegateText = data.person.delegate_status.toUpperCase().replace(/_/g, ' ');
        document.querySelector(".leftTopContent").innerHTML = `
        <div class="emblem">
                        <img src="icons/redBase.svg" alt="Emblem Base" class="emblem-base">
                        <svg viewBox="0 0 120 120" class="text-svg">
                            <defs>
                                <path id="circlePath" d="M 60, 60 m -46, 0 a 46,46 0 1,1 92,0 a 46,46 0 1,1 -92,0" />
                            </defs>
                            <text font-size="12" font-weight="bold" fill="white" letter-spacing="1.1">
                              <textPath href="#circlePath" startOffset="50%" text-anchor="middle">
                                ${delegateText}
                              </textPath>
                            </text>
                          </svg>
                      </div>
        ` + document.querySelector(".leftTopContent").innerHTML;
    };
}


function showCompetitions(data){
    document.querySelector(".resultsPane").classList.add("hiddenPane");
    document.querySelector(".competitionsPane").classList.remove("hiddenPane");
    document.querySelector(".recordsPane").classList.add("hiddenPane");
    document.querySelector(".championshipsPane").classList.add("hiddenPane");
    document.querySelector(".mapPane").classList.add("hiddenPane");



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
        console.log(data.results);
        // Iterate over each competition in the results
        for (let [competition, events] of Object.entries(data.results)) {
            // Insert competition name as a table header row
            tableHTML += `
                <tr class="competition-header">
                    <td colspan="10" class="compTitle">${competition}</td>
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
                                <td class="bestRow">${formatTime(roundData.best)}</td>
                                <td class="averageRow">${formatTime(roundData.average)}</td>
                                <td class="timeRow">${roundData.solves.map(time => formatTime(time)).join('</td><td class="timeRow">')}</td>
                            </tr>
                        `;
                        roundFirst = false;
                    } else {
                        tableHTML += `
                            <tr>
                                <td class="eventNameRow"></td>
                                <td class="roundRow">${roundData.round}</td>
                                <td class="placeRow">${roundData.position || ''}</td>
                                <td class="bestRow">${formatTime(roundData.best)}</td>
                                <td class="averageRow">${formatTime(roundData.average)}</td>
                                <td class="timeRow">${roundData.solves.map(time => formatTime(time)).join('</td><td class="timeRow">')}</td>
                            </tr>
                        `;
                    }
                    
                }
            }
        }

        // Close the table tags
        tableHTML += `</tbody></table>`;

        document.querySelector(".competitionsPane").innerHTML = tableHTML;


        const table = document.querySelector(".resultsTable");
        const expectedColCount = table.querySelector("thead tr").children.length; // Number of columns in the header

        table.querySelectorAll("tbody tr").forEach(row => {
            const cellCount = row.children.length;

            if (cellCount < expectedColCount) {
                const colspan = expectedColCount - cellCount + 1; // Calculate colspan for the missing columns
                const emptyCell = document.createElement("td");
                emptyCell.setAttribute("colspan", colspan);
                emptyCell.innerHTML = ""; // Add blank content

                row.appendChild(emptyCell); // Append the colspan cell to make the row full-width
            }
        });
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
        "333mbf": "3x3x3 Multi-Blind"
    };
    return eventNames[eventCode] || eventCode;
}

function formatTime(time) {
    if (time === -1) return "DNF";
    if (time === -2) return "DNS";
    if (time === 0) return "";

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