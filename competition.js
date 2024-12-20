var hash;

$( document ).ready(function() {

    // Listen for the hash change event
    window.addEventListener('hashchange', function() {
        // Reload the page when the hash changes
        location.reload();
    });

    if (window.location.hash) {
        hash = window.location.hash.substring(1);
    }

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

    const scrollDownButton = document.querySelector('#scrollDown');

    scrollDownButton.addEventListener('click', () => {
        toggleScroll();
    });

    window.addEventListener('scroll', updateScrollText);

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


    


    $.ajax({
        url: `https://www.worldcubeassociation.org/api/v0/competitions/${hash}`,
        dataType: "json", 
        cache: true,
        success: function(data) {

            //Set Name
            document.querySelector("#title").innerHTML = `<img src="icons/bookmark.svg"  class="bookmarkIcon"/>${data.name}`;

            document.title = `${data.name} | WCA Prototype`;

            const bookmarkIcons = document.querySelectorAll(".bookmarkIcon");
    
            bookmarkIcons.forEach(icon => {
                icon.addEventListener("click", () => {
                    // Toggle the src attribute between the two images
                    if (icon.src.endsWith("icons/bookmark.svg")) {
                        icon.src = "icons/bookmarked.svg";
                    } else {
                        icon.src = "icons/bookmark.svg";
                    }
                });
            });

            // Set dates
            const startDate = new Date(data.start_date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
            const endDate = new Date(data.end_date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
            document.querySelector(".compDates").textContent = `${startDate} - ${endDate}`;
            
            // Set location
            document.querySelector(".compLocation").innerHTML = `${data.city}, <span class="bold">${countryCodeMapping[data.country_iso2] || data.country_iso2}</span>`;
            
            // Set competitor limit
            document.querySelector(".compCompetitorLimit").textContent = data.competitor_limit || "Unlimited";
            
            // Set venue details
            document.querySelector(".compVenueDetails").innerHTML = marked.parse(data.venue);
            if (data.venue_details != ""){
                document.querySelector(".compVenueDetailsFull").innerHTML = marked.parse(data.venue_details);
            } else {
                document.querySelector(".compVenueDetailsFull").parentElement.remove();
            }


            //bookmarks
            document.querySelector(".bookmarked").textContent = data.number_of_bookmarks + " Times";

            // Set registration fee
            const fee = data.base_entry_fee_lowest_denomination / 100;
            document.querySelector(".compBaseRegistrationFee").textContent = `$${fee} ${data.currency_code}`;

            // Set spectator policy
            if (data.guests_entry_fee_lowest_denomination == 0){
                document.querySelector(".compSpectators").textContent = "Free";
            } else {
                document.querySelector(".compSpectators").textContent = `$${data.guests_entry_fee_lowest_denomination/100} ${data.currency_code}` || "See details";
            }


            // Link for comp details
            document.querySelector(".compDetails").href = `https://www.worldcubeassociation.org/competitions/${data.id}.pdf`;

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

            let delegates = ''; // Initialize the variable outside
            for (const delegate of data.delegates) {
                if (delegate.wca_id != null) {
                    delegates += `<a href="results.html#${delegate.wca_id}">${delegate.name}</a>, `; // Append each name followed by a comma
                } else {
                    delegates += `${delegate.name}, `; // Append each name followed by a comma
                }
            }
            delegates = delegates.slice(0, -2); // Remove the trailing comma and space

            document.querySelector(".compDelegates").innerHTML = delegates;

            // Set venue contact and address details
            document.querySelector(".compVenueAddress").textContent = data.venue_address;

            // Set refund policy
            document.querySelector(".compRefundPolicy").innerHTML = 
                `If your registration is cancelled before ${closeDate} you will be refunded <span class="bold">${data.refund_policy_percent}%</span> of your registration fee.`;


            document.querySelector(".compContact").innerHTML = marked.parse(data.contact);
                
            const markdownRegistrationRequirements = data.extra_registration_requirements;
            const markdownInformation = data.information;

            // Convert the Markdown to HTML
            const htmlContent = "<div class=\"markdownInfo\">" + marked.parse(markdownInformation) + "</div>" + marked.parse(markdownRegistrationRequirements);

            // Insert the HTML into the page
            document.querySelector(".generalInfo").innerHTML += `
                <div class="markdown-content">
                    ${htmlContent}
                </div>
            `;

            const generalInfo = document.querySelector('.generalInfo');
            const bentoImg = document.querySelector('.bentoImg');
            const bentoImgImage = document.querySelector('.bentoImgImage');

            if (generalInfo) {
                const imgTag = generalInfo.querySelector('img');
                
                if (imgTag) {
                    // Duplicate the first image's src value into the .bentoImgImage tag
                    if (bentoImgImage) {
                        bentoImgImage.src = imgTag.src;
                    }
                } else {
                    // Remove the .bentoImg div if no img tag is found
                    if (bentoImg) {
                        bentoImg.remove();
                    }
                }
            }


            console.log(data);


            $(document).ready(function() {
                $.ajax({
                    url: `https://www.worldcubeassociation.org/api/v0/competitions/${data.id}/wcif/public`,
                    dataType: "json", 
                    cache: true,
                    success: function(dataWCIF) {
                        // Function to render the table
                        function renderTable(persons) {
                            console.log();
                            document.querySelector(".spotsLeft").innerHTML = `${data.competitor_limit - persons.length}/${data.competitor_limit}`;
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
                            tableHTML += `<div class="notAvail">Psych Sheet not available in this prototype</div>`;
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
    scheduleInfoDiv.innerHTML = tableHTML + `<div class="notAvail">Schedule not available in this prototype</div>`;

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
    eventsInfoDiv.innerHTML = tableHTML + `<div class="notAvail">Events Table not available in this prototype</div>`;
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

function toggleScroll() {
    const id = 'scrollDown'; // Hard-coded ID
    const element = document.getElementById(id);
    
    if (!element) {
        console.error(`Element with ID "${id}" not found.`);
        return;
    }

    const elementPosition = element.offsetTop;
    const currentScrollPosition = window.scrollY;

    if (Math.abs(currentScrollPosition - elementPosition) < 100) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        window.scrollTo({ top: elementPosition, behavior: 'smooth' });
    }
}

function updateScrollText(){
    const id = 'scrollDown'; // Hard-coded ID
    const element = document.getElementById(id);
    
    if (!element) {
        console.error(`Element with ID "${id}" not found.`);
        return;
    }

    const elementPosition = element.offsetTop;
    const currentScrollPosition = window.scrollY;

    if (Math.abs(currentScrollPosition - elementPosition) < 100) {
        element.textContent = "▲ Show General Info ▲";
    } else {
        element.textContent = "▼ Hide General Info ▼";
    }
}