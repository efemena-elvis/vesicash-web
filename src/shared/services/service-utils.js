import countries from "@/utilities/countries";
import { serviceStorage } from "@/shared/services";
import { constants } from "@/utilities";

class serviceUtils {
  /**
   * The function logs out the user by clearing the local storage and redirecting to the login page.
   */
  storage_exception_key = "identifier_token";

  logOutUser() {
    // PRIORITY REMOVALS ON LOGOUT
    serviceStorage.removeStorage(constants.VESICASH_AUTH_USER);
    serviceStorage.removeStorage(constants.VESICASH_AUTH_TOKEN);

    serviceStorage.removeStorage("app_onboarding");
    serviceStorage.removeStorage("timestamp");

    for (let i = 0; i < localStorage.length; i++) {
      const local_key = localStorage.key(i);
      if (local_key !== this.storage_exception_key) {
        serviceStorage.removeStorage(local_key);
      }
    }

    // REDIRECT TO LOGIN PAGE
    location.href = "/login";
  }

  checkAuthTimeout(minutes) {
    const timeout = Number(minutes) * 60000;
    const entry_time = Number(localStorage.timestamp ?? 0);
    const current_time = Number(+new Date());

    if (current_time - entry_time > timeout) {
      return true;
    } else {
      localStorage.timestamp = +new Date();
      return false;
    }
  }

  setPageBackgroundColor(color) {
    document.body.style.backgroundColor = color;
  }

  getRandomNumber(max, min) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  urlHash(url) {
    return url.includes("?")
      ? `${url}&timestamp=${new Date().getTime()}`
      : `${url}?timestamp=${new Date().getTime()}`;
  }

  getRandomString(length) {
    let randomstring = "";
    const chars =
      "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";

    for (let i = 0; i < length; i++) {
      const rnum = Math.floor(Math.random() * chars.length);
      randomstring += chars.substring(rnum, rnum + 1);
    }
    return randomstring;
  }

  encodeString(string) {
    return btoa(
      `${this.getRandomString(5)}+${string}+${this.getRandomString(5)}`
    );
  }

  decodeString(encoded_string) {
    return atob(encoded_string).split("+")[1];
  }

  getCapitalizeText(text) {
    const text_list = text.split(" ");
    const first_letters = [];
    const modified_list = [];

    text_list.map((text) => first_letters.push(text?.charAt(0)));
    text_list.map((text, index) =>
      modified_list.push(
        `${first_letters[index]?.toUpperCase()}${text?.substring(1)}`
      )
    );

    return modified_list.join(" ");
  }

  capitalizeFirstLetter(string) {
    const words = string.split(" ");

    if (words.length > 0) {
      words[0] = words[0][0].toUpperCase() + words[0].substring(1);
      return words.join(" ");
    }

    return string;
  }

  getStringInitials(string) {
    const string_list = string.replace(/\s+/g, " ").split(" ");

    return string_list.length === 1
      ? string_list[0].slice(0, 1).toUpperCase()
      : `${string_list[0].slice(0, 1).toUpperCase()}${string_list[1]
          .slice(0, 1)
          .toUpperCase()}`;
  }

  getFirstCharacter(string) {
    const string_list = string.replace(/\s+/g, " ").split(" ");
    return string_list[0].slice(0, 1).toUpperCase();
  }

  getTruncatedText(string, length) {
    return string.length > length ? `${string.slice(0, length)}...` : string;
  }

  isOddNumber(items) {
    if (items === 1) return true;
    else if (items === 0) return false;
    else return items % 2 ? true : false;
  }

  getAsterickedText(text, positions) {
    if (!text) return "";
    let formatted_text = "";
    formatted_text = positions
      .reduce((acc, val) => {
        acc[val] = "*";
        return acc;
      }, text.split(""))
      .join("");

    return formatted_text;
  }

  isNumber(value) {
    return typeof value === "number" && !Number.isNaN(value);
  }

  getTimestampInSeconds() {
    const current_time = new Date().getTime();
    const timestamp_in_seconds = current_time / 1000;
    return Math.floor(timestamp_in_seconds);
  }

  // ============================================================
  // METHODS RELATED TO CURRENCY HANDLING
  // ============================================================
  // output => 'sign', 'code', 'long'
  formatCurrency({ input, output = "" }) {
    let country_data = countries.find(
      (country) =>
        country.code.toLowerCase() === input.toLowerCase() ||
        country.currency.sign.toLowerCase() === input.toLowerCase() ||
        country.currency.short.toLowerCase() === input.toLowerCase() ||
        country.currency.long.toLowerCase() === input.toLowerCase()
    );

    if (country_data !== "undefined") {
      if (output) {
        if (output === "code") return country_data[output];
        else return country_data?.currency[output];
      } else return country_data;
    } else {
      return "No currency input was found";
    }
  }

  formatCurrencyWithComma(currency) {
    return new Intl.NumberFormat().format(currency);
  }

  createAndClickAnchor(href, target = "_self") {
    const anchor = document.createElement("a");

    anchor.href = href;
    anchor.target = target;

    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }
}

export default new serviceUtils();
