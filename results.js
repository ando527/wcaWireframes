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
            console.log(data);
            document.querySelector("#profileName").innerHTML = data.name;
            document.querySelector(".wcaId").innerHTML = data.id;
            document.querySelector(".comps").innerHTML = data.numberOfCompetitions;
            document.querySelector(".solves").innerHTML = countTotalValidSolves(data);
            for (let result of data.rank.singles){
                document.querySelector("#results").innerHTML += `
                <tr class="resultRow-${result.eventId}"> 
                    <td class="icon"><img src="icons/${result.eventId}.svg"/></td>
                    <td class="event left">${result.eventId}</td>
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

                if (response.records.continental == 0 && response.records.national == 0 && response.records.world == 0){
                    document.querySelector(".recordsHolder").remove();
                }

                  $('#profilePhoto').css('background-image', `url(${avatarUrl})`);
                },
                error: function(error) {
                  console.error("Error fetching data:", error);
                }
              });
        }
    });
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
        return parseFloat(result).toFixed(2)/100;
    }
}

function secToMin(seconds){
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const paddedSeconds = remainingSeconds.toString().padStart(2, '0');
    
    return `${minutes}:${paddedSeconds}`;
}