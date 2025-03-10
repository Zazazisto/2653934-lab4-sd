document.getElementById('country-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const countryName = document.getElementById('country-input').value.trim();
    if (!countryName) {
        alert('Please enter a country name.');
        return;
    }

    fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Country not found. Please check the name and try again.');
            }
            return response.json();
        })
        .then(data => {
            const country = data[0];
            document.getElementById('capital').textContent = country.capital[0];
            document.getElementById('population').textContent = country.population.toLocaleString();
            document.getElementById('region').textContent = country.region;
            document.getElementById('flag').src = country.flags.png;

            const borderingCountriesList = document.getElementById('bordering-countries-list');
            borderingCountriesList.innerHTML = '';

            if (country.borders && country.borders.length > 0) {
                fetch(`https://restcountries.com/v3.1/alpha?codes=${country.borders.join(',')}`)
                    .then(response => response.json())
                    .then(borderingCountries => {
                        borderingCountries.forEach(borderingCountry => {
                            const li = document.createElement('li');
                            const flagImg = document.createElement('img');

                            flagImg.src = borderingCountry.flags.png;
                            flagImg.alt = `${borderingCountry.name.common} Flag`;
                            flagImg.style.width = '250px';
                            li.textContent = `${borderingCountry.name.common}:`;
                            
                            li.appendChild(document.createElement('br'));
                            li.appendChild(flagImg);
                            borderingCountriesList.appendChild(li);
                        });
                    });
            } else {
                const li = document.createElement('li');
                li.textContent = 'No bordering countries.';
                borderingCountriesList.appendChild(li);
            }
        })
        .catch(error => {
            alert(error.message);
        });
});