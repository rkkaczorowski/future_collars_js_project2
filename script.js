document.addEventListener("DOMContentLoaded", function () {
	const currencyForm = document.getElementById("currencyForm");
	const resultElement = document.getElementById("result");
	const loader = document.getElementById("loader");

	currencyForm.addEventListener("submit", async function (event) {
		event.preventDefault();

		const formData = new FormData(currencyForm);
		const fromCurrency = formData.get("currency");
		const amount = parseFloat(formData.get("amount"));

		if (!isNaN(amount) && amount > 0) {
			loader.style.display = "block";

			try {
				const result = await currencyConverter(fromCurrency, amount);
				if (result !== null) {
					resultElement.innerText = `${amount} ${fromCurrency} to ${result.toFixed(
						2
					)} PLN`;
				} else {
					resultElement.innerText = "Nie udało się przeliczyć waluty.";
				}
			} catch (error) {
				console.error("Wystąpił błąd:", error);
				resultElement.innerText = "Wystąpił błąd. Spróbuj ponownie później.";
			}

			loader.style.display = "none";
		} else {
			resultElement.innerText = "Proszę podać prawidłową kwotę.";
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
		throw error;
	}
}
