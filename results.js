var map;
var markerLayer;
var data = {
    resource_id: "wcaID",
};

var data2 = {
    resource_id: "wcaCompID",
};

$( document ).ready(function() {
    

    $.ajax({
        url: "https://raw.githubusercontent.com/robiningelbrecht/wca-rest-api/master/api/persons/2022ANDE01.json",
        dataType: "json", 
        cache: true,
        success: function(data) {
            console.log(data);
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
            $.ajax({
                url: `https://www.worldcubeassociation.org/api/v0/persons/${data.id}`,
                method: "GET",
                success: function(response) {
                  const avatarUrl = response.person.avatar.url;
                  //console.log("Avatar URL:", avatarUrl);
                  $('#profilePhoto').css('background-image', `url(${avatarUrl})`);
                },
                error: function(error) {
                  console.error("Error fetching data:", error);
                }
              });
        }
    });
});

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