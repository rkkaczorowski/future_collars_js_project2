document.addEventListener("DOMContentLoaded", function () {
	const convertBtn = document.getElementById("convertBtn");
	const loader = document.getElementById("loader");

	convertBtn.addEventListener("click", async function () {
		const fromCurrency = document.getElementById("currency").value;
		const amount = parseFloat(document.getElementById("amount").value);

		if (!isNaN(amount)) {
			loader.style.display = "block"; // Wyświetl loader

			const result = await currencyConverter(fromCurrency, amount);
			if (result !== null) {
				document.getElementById(
					"result"
				).innerText = `${amount} ${fromCurrency} to ${result.toFixed(2)} PLN`;
			} else {
				document.getElementById("result").innerText =
					"Nie udało się przeliczyć waluty.";
			}

			loader.style.display = "none"; // Ukryj loader po zakończeniu pobierania danych
		} else {
			document.getElementById("result").innerText =
				"Proszę podać prawidłową kwotę.";
		}
	});
});

async function currencyConverter(fromCurrency, amount) {
	try {
		const response = await fetch(
			`https://api.nbp.pl/api/exchangerates/rates/a/${fromCurrency}/?format=json`
		);
		const data = await response.json();

		if (!data.rates || !data.rates.length) {
			throw new Error("Nie udało się pobrać kursu waluty");
		}

		const exchangeRate = data.rates[0].mid;
		const result = amount * exchangeRate;

		return result;
	} catch (error) {
		console.error("Wystąpił błąd:", error);
		return null;
	}
}
