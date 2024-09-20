var infoPane;
var allFutureComps = [];
var lastClicked;

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
    addRows();
}

function addRows(){
    var competitionTable = document.querySelector("#compTBody");
    allFutureComps.slice(0, 100).forEach(function(competition) {
        competitionTable.innerHTML += `
        <tr id="${competition.id}" class="compRow">
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
        `; // Example: Log competition names
    });

                // Get all elements with the class 'compRow'
    let compRows = document.querySelectorAll('.compRow');
        compRows.forEach(function(row) {
            row.addEventListener('click', function() {
                let elementId = row.id; // Get the id of the clicked element
                handleRowClick(elementId); // Call your function and pass the id
        });
    });

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
    infoPane = document.querySelector("#infoPane");
    let competition = allFutureComps.find(comp => comp.id === id);
    if (lastClicked){
        lastClicked.classList.remove("highlightedRow");
    }
    lastClicked = document.querySelector("#" + id);
    lastClicked.classList.add("highlightedRow");
    if (competition) {
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
    } else {
        console.log("Competition not found error.");
    }
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
    let eventStringBuilder = `<tr class="eventRow" style="display: none;"><td></td><td></td><td class="eventsTitleRow">Events:</td><td>`;
    events.forEach(function(event) {
        eventStringBuilder += `
            <img class="indivEventRow" src="icons/${event}.svg"" />
        `;
    });
    eventStringBuilder += "</td><td></td><td></td></tr>";
    return eventStringBuilder;
}
