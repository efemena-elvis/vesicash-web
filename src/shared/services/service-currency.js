// ============================================================
// ALL APPLICATION METHODS RELATED TO CURRENCY HANDLING
// ============================================================

class serviceCurrency {
  // ===================================
  // FORMAT CURRENCY SIGN
  // ===================================
  getSign(currency) {
    let currency_type = "",
      naira = "₦",
      dollar = "$",
      pound = "£";

    switch (currency) {
      case "naira":
      case "NGN":
      case "ng":
        currency_type = naira;
        break;
      case "dollar":
      case "USD":
      case "us":
        currency_type = dollar;
        break;
      case "pound":
      case "GBP":
      case "gb":
        currency_type = pound;
        break;
      default:
        console.log("Currency sign not available yet!");
    }

    return currency_type;
  }

  getCode(currency, dialing_code = null) {
    let currency_type = "",
      naira = "NGN",
      dollar = "USD",
      pound = "GBP";

    switch (currency) {
      case "naira":
      case "NGN":
      case "ng":
        currency_type = naira;
        break;
      case "dollar":
      case "USD":
      case "us":
        currency_type = dollar;
        break;
      case "pound":
      case "GBP":
      case "gb":
        currency_type = pound;
        break;
      default:
        currency_type = dialing_code;
    }

    return currency_type;
  }
}

export default new serviceCurrency();
