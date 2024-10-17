$( document ).ready(function() {

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




        }
    });
});


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