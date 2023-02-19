export async function getMarketDeals() {
    const deals = await fetch(
        "https://marketdeals-hyperspace.s3.amazonaws.com/StateMarketDeals.json"
    );
    const dealsJson = await deals.json();
    const dealsArrayJson = [];
    // for (const deal in dealsJson) {
    //     dealsArrayJson.push(dealsJson[deal])
    // }
    console.log(Object.keys(dealsJson));
}
