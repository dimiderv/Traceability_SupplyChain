const farmerTransactionDetails = [
  {
    cardTitle: "Initialize Ledger",
    cardText: "For the purpose of this App populate the Ledger",
    linkRef: "/initLedger",
    buttonText: "Initilize Ledger",
  },
  {
    cardTitle: "Create Asset",
    cardText: "Create an asset that you harvested",
    linkRef: "/createAsset",
    buttonText: "Create",
  },
  {
    cardTitle: "Update Sensor Data",
    cardText: "Update sensor Data",
    linkRef: "/farmerFrontPage/updateSensorData",
    buttonText: "Update Sensor",
  },
  {
    cardTitle: "Delete Asset",
    cardText: "Delete an asset",
    linkRef: "/farmerFrontPage/deleteAsset",
    buttonText: "Delete",
  },
  {
    cardTitle: "Set Price for an asset",
    cardText: "Sets the price for the asset on owners implicit collection",
    linkRef: "/farmerFrontPage/setPrice",
    buttonText: "Set Price",
  },
  {
    cardTitle: "Transfer Asset",
    cardText: "You can Transfer Asset",
    linkRef: "/farmerFrontPage/transferRequestedAsset",
    buttonText: "Transfer Asset",
  },
];

const retailerTransactionDetails = [
  {
    cardTitle: "Update Sensor Data",
    cardText: "Update sensor",
    linkRef: "/retailerFrontPage/updateSensorData",
    buttonText: "Update sensor",
  },
  {
    cardTitle: "Delete Buy Request",
    cardText: "Delete the buy Request after asset transfer.",
    linkRef: "/retailerFrontPage/deleteBuyRequest",
    buttonText: "Delete Buy Request",
  },
  {
    cardTitle: "Delete Bid Request",
    cardText: "Delete the bid Request after asset transfer.",
    linkRef: "/retailerFrontPage/deleteBidRequest",
    buttonText: "Delete Bid Request",
  },
  {
    cardTitle: "Delete Asset",
    cardText: "Delete an asset",
    linkRef: "/retailerFrontPage/deleteAsset",
    buttonText: "Delete",
  },
  {
    cardTitle: "Set Price for an asset",
    cardText: "Sets the price for the asset on owners implicit collection",
    linkRef: "/retailerFrontPage/setPrice",
    buttonText: "Set Price",
  },
  {
    cardTitle: "Transfer Asset",
    cardText: "You can Transfer Asset",
    linkRef: "/retailerFrontPage/transferRequestedAsset",
    buttonText: "Transfer Asset",
  },
  {
    cardTitle: "Request to Buy",
    cardText: "Request to Buy and asset from Farmers Org",
    linkRef: "/retailerFrontPage/requestToBuy",
    buttonText: "Request to Buy",
  },
  {
    cardTitle: "Agree to Buy",
    cardText: "Agree on price and buy asset from Farmers Org",
    linkRef: "/retailerFrontPage/agreeToBuy",
    buttonText: "Agree to Buy",
  },
];

const superMarketTransactionDetails = [
  {
    cardTitle: "Update Sensor Data",
    cardText: "Update sensor",
    linkRef: "/supermarketFrontPage/updateSensorData",
    buttonText: "Update sensor",
  },
  {
    cardTitle: "Delete Buy Request",
    cardText: "Delete the buy Request after asset transfer.",
    linkRef: "/supermarketFrontPage/deleteBuyRequest",
    buttonText: "Delete Buy Request",
  },
  {
    cardTitle: "Delete Bid Request",
    cardText: "Delete the bid Request after asset transfer.",
    linkRef: "/supermarketFrontPage/deleteBidRequest",
    buttonText: "Delete Bid Request",
  },
  {
    cardTitle: "Delete Asset",
    cardText: "Delete an asset",
    linkRef: "/supermarketFrontPage/deleteAsset",
    buttonText: "Delete",
  },
  {
    cardTitle: "Request to Buy",
    cardText: "Request to Buy and asset from Farmers Org",
    linkRef: "/supermarketFrontPage/requestToBuy",
    buttonText: "Request to Buy",
  },
  {
    cardTitle: "Agree to Buy",
    cardText: "Agree on price and buy asset from Farmers Org",
    linkRef: "/supermarketFrontPage/agreeToBuy",
    buttonText: "Agree to Buy",
  },
];

const farmerQueryDetails = [
  {
    cardTitle: "Search Asset",
    cardText: "See if an asset Exists",
    linkRef: "/farmerFrontPage/assetExists",
    buttonText: "Search Asset",
  },
  {
    cardTitle: "Read buy request",
    cardText: "You can Read buy request from Retailers",
    linkRef: "/farmerFrontPage/readBuyRequest",
    buttonText: "Read Request",
  },
  {
    cardTitle: "Asset History",
    cardText: "You can Read asset history",
    linkRef: "/farmerFrontPage/getAssetHistory",
    buttonText: "Get Asset History",
  },
  {
    cardTitle: "Available Products",
    cardText: "Here are the Available Products",
    linkRef: "/farmerFrontPage/getAllAssets",
    buttonText: "More info",
  },
];

const retailerQueryDetails = [
  {
    cardTitle: "Search Asset",
    cardText: "See if an asset Exists",
    linkRef: "/retailerFrontPage/assetExists",
    buttonText: "Search Asset",
  },
  {
    cardTitle: "Read buy request",
    cardText: "You can Read buy request from Retailers",
    linkRef: "/retailerFrontPage/readBuyRequest",
    buttonText: "Read Request",
  },
  {
    cardTitle: "Asset History",
    cardText: "You can Read asset history",
    linkRef: "/retailerFrontPage/getAssetHistory",
    buttonText: "Get Asset History",
  },
  {
    cardTitle: "Available Products",
    cardText: "Here are the Available Products",
    linkRef: "/retailerFrontPage/getAllAssets",
    buttonText: "More info",
  },
];

const superMarketQueryDetails = [
  {
    cardTitle: "Search Asset",
    cardText: "See if an asset Exists",
    linkRef: "/supermarketFrontPage/assetExists",
    buttonText: "Search Asset",
  },
  {
    cardTitle: "Read buy request",
    cardText: "You can Read buy request from Retailers",
    linkRef: "/supermarketFrontPage/readBuyRequest",
    buttonText: "Read Request",
  },
  {
    cardTitle: "Asset History",
    cardText: "You can Read asset history",
    linkRef: "/supermarketFrontPage/getAssetHistory",
    buttonText: "Get Asset History",
  },
  {
    cardTitle: "Available Products",
    cardText: "Here are the Available Products",
    linkRef: "/supermarketFrontPage/getAllAssets",
    buttonText: "More info",
  },
];
const farmerCardContainerdetails = [
  {
    titleText: "Transactions",
    containerClass: "transaction-container",
    cardsClass: "transaction-cards",
    cardsDetails: farmerTransactionDetails,
  },
  {
    titleText: "Queries",
    containerClass: "query-container",
    cardsClass: "query-cards",
    cardsDetails: farmerQueryDetails,
  },
];
const retailerCardContainerdetails = [
  {
    titleText: "Transactions",
    containerClass: "transaction-container",
    cardsClass: "transaction-cards",
    cardsDetails: retailerTransactionDetails,
  },
  {
    titleText: "Queries",
    containerClass: "query-container",
    cardsClass: "query-cards",
    cardsDetails: retailerQueryDetails,
  },
];
const superMarketCardContainerdetails = [
  {
    titleText: "Transactions",
    containerClass: "transaction-container",
    cardsClass: "transaction-cards",
    cardsDetails: superMarketTransactionDetails,
  },
  {
    titleText: "Queries",
    containerClass: "query-container",
    cardsClass: "query-cards",
    cardsDetails: superMarketQueryDetails,
  },
];

export {
  farmerCardContainerdetails,
  retailerCardContainerdetails,
  superMarketCardContainerdetails,
};
