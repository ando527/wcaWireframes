const countryCodeMapping = {
    // Africa
    "DZ": "Algeria",
    "EG": "Egypt",
    "GH": "Ghana",
    "KE": "Kenya",
    "MA": "Morocco",
    "NG": "Nigeria",
    "ZA": "South Africa",
    "MU": "Mauritius",
    
    // Asia
    "AF": "Afghanistan",
    "CN": "China",
    "HK": "Hong Kong",
    "IN": "India",
    "ID": "Indonesia",
    "IR": "Iran",
    "IL": "Israel",
    "JP": "Japan",
    "KZ": "Kazakhstan",
    "KR": "Republic of Korea",
    "KW": "Kuwait",
    "LB": "Lebanon",
    "MY": "Malaysia",
    "PH": "Philippines",
    "QA": "Qatar",
    "SA": "Saudi Arabia",
    "SG": "Singapore",
    "TW": "Chinese Taipei",
    "TH": "Thailand",
    "TR": "Turkey",
    "AE": "United Arab Emirates",
    "VN": "Vietnam",
    "AZ": "Azerbaijan",
    "MN": "Mongolia",
    "NP": "Nepal",
    "LK": "Sri Lanka",
    "BT": "Bhutan",
    "BD": "Bangladesh",
    "KG": "Kyrgyzstan",
    
    // Europe
    "AT": "Austria",
    "BE": "Belgium",
    "BG": "Bulgaria",
    "CZ": "Czech Republic",
    "DK": "Denmark",
    "EE": "Estonia",
    "FI": "Finland",
    "FR": "France",
    "DE": "Germany",
    "GR": "Greece",
    "HU": "Hungary",
    "IS": "Iceland",
    "IE": "Ireland",
    "IT": "Italy",
    "LV": "Latvia",
    "LT": "Lithuania",
    "NL": "Netherlands",
    "NO": "Norway",
    "PL": "Poland",
    "PT": "Portugal",
    "RO": "Romania",
    "RU": "Russia",
    "RS": "Serbia",
    "SK": "Slovakia",
    "SI": "Slovenia",
    "ES": "Spain",
    "SE": "Sweden",
    "CH": "Switzerland",
    "UA": "Ukraine",
    "GB": "United Kingdom",
    "GE": "Georgia",
    "HR": "Croatia",
    "ME": "Montenegro",
    
    // North America
    "BS": "Bahamas",
    "BB": "Barbados",
    "CA": "Canada",
    "CR": "Costa Rica",
    "CU": "Cuba",
    "DO": "Dominican Republic",
    "SV": "El Salvador",
    "GT": "Guatemala",
    "HN": "Honduras",
    "JM": "Jamaica",
    "MX": "Mexico",
    "PA": "Panama",
    "PR": "Puerto Rico",
    "TT": "Trinidad and Tobago",
    "US": "United States",
    
    // South America
    "AR": "Argentina",
    "BO": "Bolivia",
    "BR": "Brazil",
    "CL": "Chile",
    "CO": "Colombia",
    "EC": "Ecuador",
    "PY": "Paraguay",
    "PE": "Peru",
    "UY": "Uruguay",
    "VE": "Venezuela",
    
    // Oceania
    "AU": "Australia",
    "FJ": "Fiji",
    "NZ": "New Zealand",
    "XO": "Multiple Countries (Oceania)"
};

const countryCodeToContinent = {
    // Africa
    "DZ": "AF",  // Algeria
    "EG": "AF",  // Egypt
    "GH": "AF",  // Ghana
    "KE": "AF",  // Kenya
    "MA": "AF",  // Morocco
    "NG": "AF",  // Nigeria
    "ZA": "AF",  // South Africa
    "MU": "AF",  // Mauritius

    // Asia
    "AF": "AS",  // Afghanistan
    "CN": "AS",  // China
    "HK": "AS",  // Hong Kong, China
    "IN": "AS",  // India
    "ID": "AS",  // Indonesia
    "IR": "AS",  // Iran
    "IL": "AS",  // Israel
    "JP": "AS",  // Japan
    "KZ": "AS",  // Kazakhstan
    "KR": "AS",  // Republic of Korea
    "KW": "AS",  // Kuwait
    "LB": "AS",  // Lebanon
    "MY": "AS",  // Malaysia
    "PH": "AS",  // Philippines
    "QA": "AS",  // Qatar
    "SA": "AS",  // Saudi Arabia
    "SG": "AS",  // Singapore
    "TW": "AS",  // Taiwan
    "TH": "AS",  // Thailand
    "TR": "AS",  // Turkey
    "AE": "AS",  // United Arab Emirates
    "VN": "AS",  // Vietnam

    // Europe
    "AL": "EU",  // Albania
    "AT": "EU",  // Austria
    "BE": "EU",  // Belgium
    "BG": "EU",  // Bulgaria
    "CY": "EU",  // Cyprus
    "CZ": "EU",  // Czech Republic
    "DK": "EU",  // Denmark
    "EE": "EU",  // Estonia
    "FI": "EU",  // Finland
    "FR": "EU",  // France
    "DE": "EU",  // Germany
    "GR": "EU",  // Greece
    "HU": "EU",  // Hungary
    "IS": "EU",  // Iceland
    "IE": "EU",  // Ireland
    "IT": "EU",  // Italy
    "LV": "EU",  // Latvia
    "LT": "EU",  // Lithuania
    "LU": "EU",  // Luxembourg
    "MT": "EU",  // Malta
    "NL": "EU",  // Netherlands
    "NO": "EU",  // Norway
    "PL": "EU",  // Poland
    "PT": "EU",  // Portugal
    "RO": "EU",  // Romania
    "RU": "EU",  // Russia
    "SK": "EU",  // Slovakia
    "SI": "EU",  // Slovenia
    "ES": "EU",  // Spain
    "SE": "EU",  // Sweden
    "CH": "EU",  // Switzerland
    "UA": "EU",  // Ukraine
    "GB": "EU",  // United Kingdom

    // North America
    "BS": "NA",  // Bahamas
    "BB": "NA",  // Barbados
    "CA": "NA",  // Canada
    "CR": "NA",  // Costa Rica
    "CU": "NA",  // Cuba
    "DO": "NA",  // Dominican Republic
    "SV": "NA",  // El Salvador
    "GT": "NA",  // Guatemala
    "HN": "NA",  // Honduras
    "JM": "NA",  // Jamaica
    "MX": "NA",  // Mexico
    "PA": "NA",  // Panama
    "PR": "NA",  // Puerto Rico
    "TT": "NA",  // Trinidad and Tobago
    "US": "NA",  // United States

    // South America
    "AR": "SA",  // Argentina
    "BO": "SA",  // Bolivia
    "BR": "SA",  // Brazil
    "CL": "SA",  // Chile
    "CO": "SA",  // Colombia
    "EC": "SA",  // Ecuador
    "PY": "SA",  // Paraguay
    "PE": "SA",  // Peru
    "UY": "SA",  // Uruguay
    "VE": "SA",  // Venezuela

    // Oceania
    "AU": "OC",  // Australia
    "FJ": "OC",  // Fiji
    "KI": "OC",  // Kiribati
    "FM": "OC",  // Federated States of Micronesia
    "NR": "OC",  // Nauru
    "NZ": "OC",  // New Zealand
    "PW": "OC",  // Palau
    "PG": "OC",  // Papua New Guinea
    "WS": "OC",  // Samoa
    "SB": "OC",  // Solomon Islands
    "TV": "OC",  // Tuvalu
    "VU": "OC",  // Vanuatu
};
