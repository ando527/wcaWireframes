$( document ).ready(function() {

    const generalTab = document.querySelector('.generalTab');
    const competitorsTab = document.querySelector('.competitorsTab');
    const registerTab = document.querySelector('.registerTab');
    const eventsTab = document.querySelector('.eventsTab');
    const scheduleTab = document.querySelector('.scheduleTab');

    const generalInfo = document.querySelector('.generalInfo');
    const psychSheet = document.querySelector('.psychSheet');
    const registerInfo = document.querySelector('.registerInfo');
    const eventsInfo = document.querySelector('.eventsInfo');
    const scheduleInfo = document.querySelector('.scheduleInfo');

    generalTab.addEventListener('click', () => {
        generalTab.classList.add('selected');
        competitorsTab.classList.remove('selected');
        registerTab.classList.remove('selected');
        eventsTab.classList.remove('selected');
        scheduleTab.classList.remove('selected');

        generalInfo.classList.remove('hidden');
        psychSheet.classList.add('hidden');
        registerInfo.classList.add('hidden');
        eventsInfo.classList.add('hidden');
        scheduleInfo.classList.add('hidden');
    });

    competitorsTab.addEventListener('click', () => {
        generalTab.classList.remove('selected');
        competitorsTab.classList.add('selected');
        registerTab.classList.remove('selected');
        eventsTab.classList.remove('selected');
        scheduleTab.classList.remove('selected');


        generalInfo.classList.add('hidden');
        psychSheet.classList.remove('hidden');
        registerInfo.classList.add('hidden');
        eventsInfo.classList.add('hidden');
        scheduleInfo.classList.add('hidden');
    });

    registerTab.addEventListener('click', () => {
        generalTab.classList.remove('selected');
        competitorsTab.classList.remove('selected');
        registerTab.classList.add('selected');
        eventsTab.classList.remove('selected');
        scheduleTab.classList.remove('selected');


        generalInfo.classList.add('hidden');
        psychSheet.classList.add('hidden');
        registerInfo.classList.remove('hidden');
        eventsInfo.classList.add('hidden');
        scheduleInfo.classList.add('hidden');
    });

    eventsTab.addEventListener('click', () => {
        generalTab.classList.remove('selected');
        competitorsTab.classList.remove('selected');
        registerTab.classList.remove('selected');
        eventsTab.classList.add('selected');
        scheduleTab.classList.remove('selected');


        generalInfo.classList.add('hidden');
        psychSheet.classList.add('hidden');
        registerInfo.classList.add('hidden');
        eventsInfo.classList.remove('hidden');
        scheduleInfo.classList.add('hidden');
    });

    scheduleTab.addEventListener('click', () => {
        generalTab.classList.remove('selected');
        competitorsTab.classList.remove('selected');
        registerTab.classList.remove('selected');
        eventsTab.classList.remove('selected');
        scheduleTab.classList.add('selected');


        generalInfo.classList.add('hidden');
        psychSheet.classList.add('hidden');
        registerInfo.classList.add('hidden');
        eventsInfo.classList.add('hidden');
        scheduleInfo.classList.remove('hidden');
    });






    $.ajax({
        url: `https://www.worldcubeassociation.org/api/v0/competitions/BrisbaneMegaBlind2024`,
        dataType: "json", 
        cache: true,
        success: function(data) {

            //Set Name
            document.querySelector("#title").innerHTML = `<img src="icons/bookmark.svg" />${data.name}`;

            // Set dates
            const startDate = new Date(data.start_date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
            const endDate = new Date(data.end_date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
            document.querySelector(".compDates").textContent = `${startDate} - ${endDate}`;
            
            // Set location
            document.querySelector(".compLocation").innerHTML = `${data.venue_address}, <span class="bold">${countryCodeMapping[data.country_iso2] || data.country_iso2}</span>`;
            
            // Set competitor limit
            document.querySelector(".compCompetitorLimit").textContent = data.competitor_limit || "Unlimited";
            
            // Set venue details
            document.querySelector(".compVenueDetails").textContent = data.venue_details;
            document.querySelector(".compVenueDetailsFull").textContent = data.venue_details;

            // Set registration fee
            const fee = data.base_entry_fee_lowest_denomination / 100;
            document.querySelector(".compBaseRegistrationFee").textContent = `$${fee} ${data.currency_code}`;

            // Set spectator policy
            document.querySelector(".compSpectators").textContent = data.guest_policy || "See details";

            // Set on the spot registration
            document.querySelector(".compOnTheSpot").textContent = data.on_the_spot_registration ? "Yes" : "No";

            // Set registration open and close times
            const openDate = new Date(data.registration_open).toLocaleString('en-AU', { timeZone: 'Australia/Brisbane' });
            const closeDate = new Date(data.registration_close).toLocaleString('en-AU', { timeZone: 'Australia/Brisbane' });
            document.querySelector(".compRegoOpens").textContent = openDate;
            document.querySelector(".compRegoCloses").textContent = closeDate;

            // Set events list
            const eventsIconsContainer = document.querySelector(".eventsIcons");
            eventsIconsContainer.innerHTML = "";  // Clear existing icons
            data.event_ids.forEach(eventId => {
                const img = document.createElement("img");
                img.classList.add("indivEventIcon");
                if (eventId == data.main_event_id){
                    img.classList.add("mainEvent");
                    img.title = "Main Event: " + getEventName(eventId);
                } else {
                    img.title = getEventName(eventId);
                }
                img.src = `icons/${eventId}.svg`;
                
                eventsIconsContainer.appendChild(img);
            });

            // Set organizers and delegates
            const organizers = data.organizers.map(org => org.name).join(', ');
            document.querySelector(".compOrganisers").textContent = organizers;

            const delegates = data.delegates.map(del => del.name).join(', ');
            document.querySelector(".compDelegates").textContent = delegates;

            // Set venue contact and address details
            document.querySelector(".compVenueAddress").textContent = data.venue_address;

            // Set refund policy
            document.querySelector(".compRefundPolicy").textContent = 
                `If your registration is cancelled before ${closeDate} you will be refunded ${data.refund_policy_percent}% of your registration fee.`;


            document.querySelector(".compContact").innerHTML = marked.parse(data.contact);
                
            const markdownRegistrationRequirements = data.extra_registration_requirements;
            const markdownInformation = data.information;

            // Convert the Markdown to HTML
            const htmlContent = marked.parse(markdownInformation) + marked.parse(markdownRegistrationRequirements);

            // Insert the HTML into the page
            document.querySelector(".generalInfo").innerHTML += `
                <div class="markdown-content">
                    ${htmlContent}
                </div>
            `;


            console.log(data);


            $(document).ready(function() {
                $.ajax({
                    url: `https://www.worldcubeassociation.org/api/v0/competitions/${data.id}/wcif/public`,
                    dataType: "json", 
                    cache: true,
                    success: function(dataWCIF) {
                        // Function to render the table
                        function renderTable(persons) {
                            let tableHTML = `
                                <table>
                                    <thead>
                                        <tr>
                                            <th class="sortable" data-sort="name">Name</th>
                                            <th class="sortable" data-sort="countryIso2">Representing</th>
                                            ${Array.isArray(data.event_ids) ? data.event_ids.map(event => `<th>${event}</th>`).join('') : ''}
                                            <th>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${persons
                                            .filter(person => person.registration !== null) // Filter out users with null registration
                                            .map(person => `
                                                <tr>
                                                    <td>${person.name}</td>
                                                    <td>${countryCodeMapping[person.countryIso2] || person.countryIso2}</td>
                                                    ${Array.isArray(data.event_ids) ? data.event_ids.map(event => `<td>${person.registration.eventIds.includes(event) ? `<img class="icon" src="icons/${event}.svg">` : ''}</td>`).join('') : ''}
                                                    <td>${Array.isArray(person.registration.eventIds) ? person.registration.eventIds.length : 0}</td>
                                                </tr>
                                            `).join('')}
                                    </tbody>
                                </table>
                            `;
                            $('.psychSheet').html(tableHTML);
                        }
            
                        // Sorting function
                        function sortTable(field) {
                            let sorted = dataWCIF.persons.sort((a, b) => {
                                if (a[field] < b[field]) return -1;
                                if (a[field] > b[field]) return 1;
                                return 0;
                            });
                            renderTable(sorted);
                        }
                        
                        console.log(dataWCIF);

                        // Initial table render
                        renderTable(dataWCIF.persons);

                        
            
                        // Add click event listeners for sorting
                        document.querySelectorAll('.sortable').forEach(header => {
                            header.addEventListener('click', () => {
                                let sortField = header.getAttribute('data-sort');
                                sortTable(sortField);
                            });
                        });


                        populateSchedule(dataWCIF.schedule);

                        populateEventsInfo(dataWCIF.events);
                    }
                });
            });


        }
    });
});

function populateSchedule(schedule) {
    const scheduleInfoDiv = document.querySelector('.scheduleInfo');

    // Create a table element for the detailed schedule
    let tableHTML = `
        <table>
            <thead>
                <tr>
                    <th>Venue</th>
                    <th>Room</th>
                    <th>Activity</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                </tr>
            </thead>
            <tbody>
    `;

    // Array to hold all activities for sorting
    let allActivities = [];

    // Loop through each venue and room to gather all activities
    schedule.venues.forEach(venue => {
        venue.rooms.forEach(room => {
            room.activities.forEach(activity => {
                allActivities.push({
                    venueName: venue.name,
                    roomName: room.name,
                    roomColor: room.color,  // Use room color
                    activityName: activity.name,
                    startTime: new Date(activity.startTime),
                    endTime: new Date(activity.endTime),
                    timeZone: venue.timezone
                });
            });
        });
    });

    // Sort activities by start time
    allActivities.sort((a, b) => a.startTime - b.startTime);

    // Generate the schedule table based on the sorted activities
    allActivities.forEach(activity => {
        tableHTML += `
            <tr>
                <td>${activity.venueName}</td>
                <td>${activity.roomName}</td>
                <td>${activity.activityName}</td>
                <td>${activity.startTime.toLocaleString('en-AU', { timeZone: activity.timeZone })}</td>
                <td>${activity.endTime.toLocaleString('en-AU', { timeZone: activity.timeZone })}</td>
            </tr>
        `;
    });

    tableHTML += `
            </tbody>
        </table><div class="calendarView"></div>
    `;

    // Insert the table into the scheduleInfo div
    scheduleInfoDiv.innerHTML = tableHTML;

    // Now generate the calendar view
    generateCalendarView(allActivities);
}

function generateCalendarView(activities) {
    const calendarDiv = document.querySelector('.calendarView');

    let calendarHTML = `<div class="calendar-grid">`;

    activities.forEach(activity => {
        const duration = (activity.endTime - activity.startTime) / (1000 * 60); // Get duration in minutes

        calendarHTML += `
            <div class="calendar-block" style="background-color: ${activity.roomColor}; height: ${duration}px;">
                <strong>${activity.activityName}</strong><br>
                ${activity.startTime.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit', timeZone: activity.timeZone })} - 
                ${activity.endTime.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit', timeZone: activity.timeZone })}
            </div>
        `;
    });

    calendarHTML += `</div>`;

    calendarDiv.innerHTML = calendarHTML;
}

function formatTimeLimit(timeLimit) {
    if (!timeLimit) return 'N/A';

    let totalSeconds = Math.floor(timeLimit.centiseconds / 100);
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;
    let milliseconds = timeLimit.centiseconds % 100;

    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}.${milliseconds < 10 ? '0' : ''}${milliseconds}`;
}

function populateEventsInfo(events) {
    const eventsInfoDiv = document.querySelector('.eventsInfo');

    let tableHTML = `
        <table>
            <thead>
                <tr>
                    <th>Event</th>
                    <th>Round</th>
                    <th>Format</th>
                    <th>Time Limit</th>
                    <th>Cutoff</th>
                    <th>Advancement</th>
                </tr>
            </thead>
            <tbody>
    `;

    // Loop through events
    events.forEach(event => {
        // Get the event name (you can map the event ID to a readable name)
        const eventName = getEventName(event.id); // Function that maps event ids like "333bf" to readable names

        event.rounds.forEach(round => {
            // Format the round info
            const format = mapFormat(round.format); // Function that maps format IDs to readable names like Bo3, Ao5, etc.
            const timeLimit = formatTimeLimit(round.timeLimit);
            const cutoff = round.cutoff ? `${round.cutoff.numberOfAttempts} attempts to get < ${formatTimeLimit({ centiseconds: round.cutoff.attemptResult })}` : 'N/A';
            const advancement = round.advancementCondition ? 
                (round.advancementCondition.type === 'percent' ? `Top ${round.advancementCondition.level}% advance` : `Top ${round.advancementCondition.level} advance`) : 'N/A';

            tableHTML += `
                <tr>
                    <td>${eventName}</td>
                    <td>${mapRoundIdToReadable(round.id)}</td> <!-- Function to map round ID to readable name -->
                    <td>${format}</td>
                    <td>${timeLimit}</td>
                    <td>${cutoff}</td>
                    <td>${advancement}</td>
                </tr>
            `;
        });
    });

    tableHTML += `
            </tbody>
        </table>
    `;

    // Insert the table into the eventsInfo div
    eventsInfoDiv.innerHTML = tableHTML;
}


// Helper function to map format IDs to readable formats
function mapFormat(formatId) {
    const formatMapping = {
        '1': 'Bo1',
        '2': 'Bo2',
        '3': 'Bo3',
        'a': 'Ao5'
    };
    return formatMapping[formatId] || formatId;
}

// Helper function to map round IDs to readable names
function mapRoundIdToReadable(roundId) {
    const roundMapping = {
        '333bf-r1': 'First round',
        '333bf-r2': 'Second round',
        '333bf-r3': 'Final',
        'minx-r1': 'First round',
        'minx-r2': 'Second round',
        'minx-r3': 'Final',
        '444bf-r1': 'Final',
        '555bf-r1': 'Final',
        '333mbf-r1': 'Final'
    };
    return roundMapping[roundId] || roundId;
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