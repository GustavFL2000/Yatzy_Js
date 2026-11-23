const tilmeldKnap = document.getElementById("BTNtilmeld");

tilmeldKnap.addEventListener("click", async () => {

    const navn = document.querySelector("#spillerNavn").value.trim();

    if (navn === "") {
        alert("Du skal indtaste et navn!");
        return;
    }

    try {
        const response = await fetch("http://localhost:8000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({ navn: navn })
        });

        if (!response.ok) {
            throw new Error("Kunne ikke oprette spiller");
        }

        const spiller = await response.json();

        console.log(spiller);

        window.location.href = "/spil.html";

    } catch (error) {
        console.error(error);
        alert("Der skete en fejl ved tilmelding");
    }
});