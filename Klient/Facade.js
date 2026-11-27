const url = "http://localhost:8000";

async function get(url) {
    const respons = await fetch(url, {
        credentials: "include"
    });

    if (!respons.ok) {
        throw new Error(respons.status);
    }

    return await respons.json();
}

async function post(url, objekt) {
    const respons = await fetch(url, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(objekt),
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (!respons.ok) {
        throw new Error(respons.status);
    }

    return await respons.json();
}
export const isScoreLocked = async (scoreId) => {
  const result = await get(
    url + "/score/locked/" + encodeURIComponent(scoreId),
  );
  return result.locked;
};

export const isGameOver = async () =>{
    const result = await get(
        url + "/score/gameover"
    );
    return result.gameover;
};

export const kastTerninger = async () => {
  return await post(url + "/terning", {});
};

export const getTurn = async () => {
    const result  = await get(
        url + "/score/turn"
    ); 
    return result.turn;
};

export const getScoreSummary = async () => {
    const result = await get(
        url + "/score/summary"
    );
    return result.summary;
};

export const setLockedDice = async (index, locked) => {
  return await post(url + "/terning/lock", {
    index: index,
    locked: locked,
  });
};

export const lockScore = async (scoreId, scoreValue) => {

    const result = await post(url + "/score/locked", {
        scoreId: scoreId,
        scoreValue: scoreValue
    });

    return result.success;
};

export const getSpillere = async () => {
    return await get(url + "/spillere");
};

export const sendAktiv = async () => { //Kald til aktiv endpointet (det er den her heartbeat fuktion der ligger og tjekker om spilleren stadig er aktiv)
    return await post(url + "/aktiv", {});
};

export const restartGame = async () => {
    return await post(url + "/restart", {});
}