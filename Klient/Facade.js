const url = "http://localhost:8000";

async function get(url) {
    const respons = await fetch(url);
    if (respons.status !== 200) // OK
        throw new Error(respons.status);
    return await respons.json();
}

async function post(url, objekt) {
    const respons = await fetch(url, {
        method: "POST",
        body: JSON.stringify(objekt),
        headers: { 'Content-Type': 'application/json' }
    });

    if (respons.status !== 201)
        throw new Error(respons.status);

    return true;
}

export const kastTerninger = async (lockedDice) => {
    return await post(url + "/terning", {
        lockedDice: lockedDice
    });
};

