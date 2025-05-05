document.addEventListener('DOMContentLoaded', function() {
     // Ensure element exists before attaching event listener
     const navigateToLeaderboardButton = document.getElementById('navigateToLeaderboard');
     if (navigateToLeaderboardButton) {
         navigateToLeaderboardButton.addEventListener('click', () => {
             window.location.href = 'leaderboard.html';
         });
     }
     const navigateToSeasonLeaderboardButton = document.getElementById('navigateToSeasonLeaderboard');
    if (navigateToSeasonLeaderboardButton) {
        navigateToSeasonLeaderboardButton.addEventListener('click', () => {
            window.location.href = 'seasonLeaders.html';
        });
    }

    const downloadLeaderboardButton = document.getElementById('downloadLeaderboard');
    if (downloadLeaderboardButton) {
        downloadLeaderboardButton.addEventListener('click', () => {
            const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
            console.log('Downloaded Leaderboard:', leaderboard);
            localStorage.setItem('downloadedLeaderboard', JSON.stringify(leaderboard));
        });
    }
    const urlParams = new URLSearchParams(window.location.search);
    document.getElementById('userName').value = decodeURIComponent(urlParams.get('userName'));
    document.getElementById('playerName').value = decodeURIComponent(urlParams.get('playerName'));
    document.getElementById('gameDate').value = decodeURIComponent(urlParams.get('gameDate'));

    const storedPoints = localStorage.getItem('currentEditPlayerPoints');
    if (storedPoints) {
        try {
            const points = JSON.parse(storedPoints);
            for (const [key, value] of Object.entries(points)) {
                document.getElementById(key).value = value;
            }
        } catch (error) {
            console.error('Error parsing stored points:', error);
        }
    }
});

const statForm = document.getElementById('statForm');
const resetButton = document.getElementById('resetButton');
const submitButton = document.getElementById('submitButton');
const calculateButton = document.getElementById('calculateButton');

if (statForm) {
    statForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const userName = document.getElementById('userName').value;
        const playerName = document.getElementById('playerName').value;
        const gameDate = document.getElementById('gameDate').value;

        const walks = parseInt(document.getElementById('walks').value) || 0;
        const single = parseInt(document.getElementById('single').value) || 0;
        const double = parseInt(document.getElementById('double').value) || 0;
        const triple = parseInt(document.getElementById('triple').value) || 0;
        const homeRun = parseInt(document.getElementById('homeRun').value) || 0;
        const SB = parseInt(document.getElementById('SB').value) || 0;
        const sacrifice = parseInt(document.getElementById('sacrifice').value) || 0;
        const rbis = parseInt(document.getElementById('rbis').value) || 0;
        const runs = parseInt(document.getElementById('runs').value) || 0;
        const outs = parseInt(document.getElementById('outs').value) || 0;
        const roe = parseInt(document.getElementById('roe').value) || 0;
        const strikeouts = parseInt(document.getElementById('strikeouts').value) || 0;
        const caughtStealing = parseInt(document.getElementById('caughtStealing').value) || 0;
        const doublePlay = parseInt(document.getElementById('doublePlay').value) || 0;
        const rispLob = parseInt(document.getElementById('rispLob').value) || 0;

        const points = {
            walks, single, double, triple, homeRun, SB, sacrifice, rbis, runs,
            outs, roe, strikeouts, caughtStealing, doublePlay, rispLob
        };

        document.getElementById('positivePoints').value = calculatePoints(walks, single, double, triple, homeRun, SB, sacrifice, rbis, runs, outs, roe, strikeouts, caughtStealing, doublePlay, rispLob);
        document.getElementById('neutralPoints').value = 0;
        document.getElementById('negativePoints').value = 0;

        const totalPoints = calculatePoints(walks, single, double, triple, homeRun, SB, sacrifice, rbis, runs, outs, roe, strikeouts, caughtStealing, doublePlay, rispLob);
        const resultDescription = generateResultDescription(walks, single, double, triple, homeRun, SB, sacrifice, rbis, runs, outs, roe, strikeouts, caughtStealing, doublePlay, rispLob);

        const resultDiv = document.getElementById('result');
        resultDiv.innerHTML = `<p>${playerName} earned ${totalPoints.toFixed(2)} points on ${gameDate}. ${resultDescription}</p>`;

        calculateButton.style.display = 'none';
        resetButton.style.display = 'inline-block';
        submitButton.style.display = 'inline-block';
    });

    document.getElementById('homeRun').addEventListener('input', function() {
        const homeRunValue = parseInt(this.value) || 0;
        const rbisInput = document.getElementById('rbis');
        const rbisValue = parseInt(rbisInput.value) || 0;
        const runsInput = document.getElementById('runs');
        const runsValue = parseInt(runsInput.value) || 0;
    
        const prevHomeRunValue = parseInt(this.getAttribute('data-prev-value')) || 0;
        const homeRunDiff = homeRunValue - prevHomeRunValue;
    
        rbisInput.value = rbisValue + homeRunDiff;
        runsInput.value = runsValue + homeRunDiff;   
        this.setAttribute('data-prev-value', homeRunValue);
    });
    
    ['strikeouts', 'doublePlay'].forEach(function(statId) {
        const inputElement = document.getElementById(statId);
        if (inputElement) {
            inputElement.addEventListener('input', function() {
                const oldValue = parseInt(this.getAttribute('data-old-value')) || 0;
                const newValue = parseInt(this.value) || 0;
                const outsInput = document.getElementById('outs');
                const outsValue = parseInt(outsInput.value) || 0;
                const difference = newValue - oldValue;
                outsInput.value = Math.max(outsValue + difference, 0);
                this.setAttribute('data-old-value', newValue);
            });
        }
    });    
}

if (resetButton) {
    resetButton.addEventListener('click', function() {
        statForm.reset();
        document.getElementById('result').innerHTML = '';

        ['positive-points', 'negative-points', 'neutral-points'].forEach(function(sectionId) {
            clearDisplayedPoints(sectionId);
        });

        calculateButton.style.display = 'inline-block';
        resetButton.style.display = 'none';
        submitButton.style.display = 'none';
    });
}

if (submitButton) {
    submitButton.addEventListener('click', function() {
        const playerName = document.getElementById('playerName').value;
        const userName = document.getElementById('userName').value;
        const gameDate = document.getElementById('gameDate').value;
        const totalPoints = parseFloat(document.getElementById('result').innerText.split('earned ')[1].split(' points')[0]);
        const resultDescription = document.getElementById('result').innerText.split('. ')[1];

        const walks = parseInt(document.getElementById('walks').value);
        const single = parseInt(document.getElementById('single').value);
        const double = parseInt(document.getElementById('double').value);
        const triple = parseInt(document.getElementById('triple').value);
        const homeRun = parseInt(document.getElementById('homeRun').value);
        const SB = parseInt(document.getElementById('SB').value);
        const sacrifice = parseInt(document.getElementById('sacrifice').value);
        const rbis = parseInt(document.getElementById('rbis').value);
        const runs = parseInt(document.getElementById('runs').value);
        const outs = parseInt(document.getElementById('outs').value);
        const roe = parseInt(document.getElementById('roe').value);
        const strikeouts = parseInt(document.getElementById('strikeouts').value);
        const caughtStealing = parseInt(document.getElementById('caughtStealing').value);
        const doublePlay = parseInt(document.getElementById('doublePlay').value);
        const rispLob = parseInt(document.getElementById('rispLob').value);

        const detailedPoints = {
            walks, single, double, triple, homeRun, SB, sacrifice, rbis, runs,
            outs, roe, strikeouts, caughtStealing, doublePlay, rispLob
        };

        const leaderboardEntry = {
            user: userName,
            name: playerName,
            points: totalPoints,
            gameDate: gameDate,
            resultDescription: resultDescription,
            pointsData: detailedPoints
        };

        let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];

        const existingIndex = leaderboard.findIndex(entry => entry.name === playerName && entry.gameDate === gameDate);

        if (existingIndex !== -1) {
            leaderboard[existingIndex] = leaderboardEntry;
        } else {
            leaderboard.push(leaderboardEntry);
        }

        localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
        window.location.href = 'leaderboard.html';
    });
}

if (document.getElementById('leaderboardBody')) {
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    renderLeaderboard(leaderboard);
}

function calculatePoints(walks, single, double, triple, homeRun, SB, sacrifice, rbis, runs, outs, roe, strikeouts, caughtStealing, doublePlay, rispLob) {
    let positivePoints = 0;
    let negativePoints = 0;
    let neutralPoints = 0;

    positivePoints += walks * 1;
    positivePoints += single * 1;
    positivePoints += double * 2;
    positivePoints += triple * 3;
    positivePoints += homeRun * 4;
    positivePoints += SB * 1;
    positivePoints += sacrifice * 1;
    positivePoints += rbis * 1;
    positivePoints += runs * 1;

    negativePoints += strikeouts * 1;
    negativePoints += caughtStealing * 1;
    negativePoints += doublePlay * 1;
    negativePoints += rispLob * 0.5;
    neutralPoints += roe * 0.0;
    neutralPoints += outs * 0.0;

    const atBats = single + double + triple + homeRun + roe + outs;

    const totalPoints = positivePoints - negativePoints;
    displayNetPoints('positive-points', positivePoints, 'green');
    displayNetPoints('negative-points', negativePoints, 'red');
    displayNetPoints('neutral-points', neutralPoints, 'gray');

    return totalPoints;
}

function generateResultDescription(walks, single, double, triple, homeRun, SB, sacrifice, rbis, runs, outs, roe, strikeouts, caughtStealing, doublePlay, rispLob) {
    const hits = single + double + triple + homeRun;
    const atBats = hits + outs + roe;
    const results = [];

    if (walks > 0) results.push(`${walks} BB/HBP`);
    if (single > 0) results.push(`${single} single${single > 1 ? 's' : ''}`);
    if (double > 0) results.push(`${double} double${double > 1 ? 's' : ''}`);
    if (triple > 0) results.push(`${triple} triple${triple > 1 ? 's' : ''}`);
    if (homeRun > 0) results.push(`${homeRun} HR`);
    if (SB > 0) results.push(`${SB} SB`);
    if (sacrifice > 0) results.push(`${sacrifice} SAC`);
    if (rbis > 0) results.push(`${rbis} RBI's`);
    if (runs > 0) results.push(`${runs} run${runs > 1 ? 's' : ''}`);

    const negativeResults = [];
    if (strikeouts > 0) negativeResults.push(`${strikeouts} strikeout${strikeouts > 1 ? 's' : ''}`);
    if (caughtStealing > 0) negativeResults.push(`${caughtStealing} caught stealing`);
    if (doublePlay > 0) negativeResults.push(`${doublePlay} GIDP`);
    if (rispLob > 0) negativeResults.push(`${rispLob} LOB`);


    const neutralResults = [];
    if (roe > 0) neutralResults.push(`${roe} ROE${roe > 1 ? 's' : ''}`);
    if (outs > 0) neutralResults.push(`${outs} out${outs > 1 ? 's' : ''}`);

    const negativePoints = (strikeouts * 1) + (caughtStealing * 1) + (doublePlay * 1) + (rispLob * 0.5);
    return `${hits}/${atBats} (${results.join(', ')}) [ -${negativePoints.toFixed(2)} (${negativeResults.join(', ')})]`;
}

function displayNetPoints(sectionId, points, color) {
    const section = document.querySelector(`.${sectionId}`);
    const title = section.querySelector('h2');
    title.innerHTML += `<span style="color: ${color};"> (${points >= 0 ? '+' : ''}${points.toFixed(2)})</span>`;
}

function clearDisplayedPoints(sectionId) {
    const section = document.querySelector(`.${sectionId}`);
    const title = section.querySelector('h2');
    title.innerHTML = title.innerHTML.split(' ')[0];

    const labels = section.querySelectorAll('label');
    labels.forEach(label => {
        label.innerHTML = label.innerHTML.split(' ')[0];
    });
}

function renderLeaderboard(leaderboard) {
    const tbody = document.getElementById('leaderboardBody');
    tbody.innerHTML = '';

    leaderboard.sort((a, b) => b.points - a.points);
    leaderboard.forEach((entry, index) => {
        const row = document.createElement('tr');
        const points = entry.points.toFixed(2);
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${entry.user}</td>
            <td>${entry.name}</td>
            <td class="points-cell">${points}</td>
            <td>${entry.gameDate}</td>
            <td>
                <button class="editButton">Edit</button>
                <button class="deleteButton">Delete</button>
            </td>
            <td>
                <button class="moreInfoButton">More Info</button>
            </td>
        `;

        const pointsCell = row.querySelector('.points-cell');
        if (entry.points >= 6.0) {
            pointsCell.style.backgroundColor = 'darkgreen';
        } else if (entry.points >= 0.00) {
            pointsCell.style.backgroundColor = 'lightgreen';
        } else if (entry.points >= -3.00 && entry.points < 0.00) {
            pointsCell.style.backgroundColor = 'lightcoral';
        } else {
            pointsCell.style.backgroundColor = 'darkred';
        }

        const detailsRow = document.createElement('tr');
        detailsRow.classList.add('details-row');
        detailsRow.innerHTML = `
            <td colspan="7">${entry.resultDescription}</td>
        `;

        row.addEventListener('click', function() {
            if (detailsRow.style.display === 'none' || !detailsRow.style.display) {
                detailsRow.style.display = 'table-row';
            } else {
                detailsRow.style.display = 'none';
            }
        });

        row.querySelector('.moreInfoButton').addEventListener('click', function(event) {
            event.stopPropagation();       
            const detailedPoints = entry.pointsData || {};
            const pointsInfo = Object.entries(detailedPoints)
                .filter(([stat, value]) => value !== 0)
                .map(([stat, value]) => `<li>${stat}: ${value}</li>`)
                .join('');
        
            const infoBox = document.createElement('div');
            infoBox.className = 'info-box';
            infoBox.innerHTML = `
                <button class="close-button">x</button>
                <ul>${pointsInfo}</ul>
            `;       
            const rect = event.target.getBoundingClientRect();
            infoBox.style.top = `${rect.bottom + window.scrollY}px`;
            infoBox.style.left = `${rect.left + window.scrollX}px`;
        
            infoBox.querySelector('.close-button').addEventListener('click', function() {
                document.body.removeChild(infoBox);
            });       
            document.body.appendChild(infoBox);
        });
    
        const editButton = row.querySelector('.editButton');
        const deleteButton = row.querySelector('.deleteButton');
        const password = "password2"; // Replace with desired password

        function promptPassword() {
            return prompt("Please enter the password:");
        }

        function verifyPassword(inputPassword) {
            return inputPassword === password;
        }

        editButton.addEventListener('click', function(event) {
            event.stopPropagation();

            const detailedPoints = entry.pointsData || {};
            localStorage.setItem('currentEditPlayerPoints', JSON.stringify(detailedPoints));

            const userName = encodeURIComponent(entry.user);
            const playerName = encodeURIComponent(entry.name);
            const gameDate = encodeURIComponent(entry.gameDate);
            window.location.href = `editForm.html?playerName=${playerName}&userName=${userName}&gameDate=${gameDate}`;
        });

        deleteButton.addEventListener('click', function(event) {
            event.stopPropagation();

            const inputPassword = promptPassword();
            if (inputPassword === null) {
                return; // Cancelled, do nothing
            }

            if (!verifyPassword(inputPassword)) {
                alert("Incorrect password!");
                return;
            }

            const confirmDelete = confirm("Are you sure you want to delete this?");
            if (confirmDelete) {
                let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
                leaderboard.splice(index, 1);
                localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
                row.remove();
                detailsRow.remove();
            } else {
                alert("Deletion canceled!");
            }
        });
        tbody.appendChild(row);
        tbody.appendChild(detailsRow);
    });
}
