const url = "http://localhost:8000/";

export const kastTerninger = async (lockedDice) => {
    return await post(url + "/terning", {
        lockedDice: lockedDice
    });
};

