import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 * There shouldn't be any frontend-specific stuff here, and there shouldn't
 * be any API-aware stuff elsewhere in the frontend.
 *
 */

class LobsterApi {
  // the token for interactive with the API will be stored here.
  static token;

  static async request(endpoint, data = {}, method = "get") {
    console.debug("API Call:", endpoint, data, method);

    //there are multiple ways to pass an authorization token, this is how you pass it in the header.
    //this has been provided to show you another way to pass the token. you are only expected to read this code for this project.
    const url = `${BASE_URL}/${endpoint}`;
    const headers = {
      Authorization: `Bearer ${
        LobsterApi.token || localStorage.getItem("token")
      }`,
    };
    const params = method === "get" ? data : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error("API Error:", err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  static token;

  // Individual API routes
  // ******** LOGIN
  static async login(email, password) {
    let res = await this.request(
      `auth/token`,
      {
        email: email,
        password: password,
      },
      "post"
    );

    LobsterApi.token = res.token;
    localStorage.setItem("token", res.token);

    return res.user;
  }
  // ******** REGISTER
  static async register(
    email,
    password,
    firstName,
    lastName,
    address,
    logo,
    isAdmin
  ) {
    let res = await this.request(
      "auth/register",
      {
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
        address: address,
        logo: logo,
      },
      "post"
    );
    return res.token;
  }

  static async getUser(userId) {
    let res = await this.request(`users/${userId}`);
    return res.user;
  }

  static async patchUser(userId, data) {
    let res = await this.request(`users/${userId}`, data, "patch");
    Input("user patched", res);
    return res;
  }

  // ** Save New Invoice */

  static async saveInvoice(userId, data) {
    let res = await this.request(`invoices/${userId}`, data, "post");
    return res.invoice;
  }

  // Modify existing Invoice
  static async patchInvoice(userId, id, data) {
    let res = await this.request(`invoices/${userId}/${id}`, data, "patch");

    return res.invoice;
  }

  /** Get Invoice. */

  static async getInvoice(userId, id) {
    let res = await this.request(`invoices/${userId}/${id}`);
    return res.invoice;
  }

  static async deleteInvoice(userId, id) {
    let res = await this.request(`invoices/${userId}/${id}`, {}, "delete");
    return "deleted", res.invoice;
  }

  /** Get list of invoices */

  static async getInvoices(userId) {
    let res = await this.request(`invoices/${userId}`);

    return res.invoices;
  }

  /** add new Client */
  static async addClient(userId, data) {
    let res = await this.request(`clients/${userId}`, data, "post");
    return res.client;
  }

  /** Modify existing Client */
  static async updateClient(userId, clientId, data) {
    let res = await this.request(
      `clients/${userId}/${clientId}`,
      data,
      "patch"
    );
    return res.client;
  }

  /** Get Client */

  static async getClient(userId, clientId) {
    let res = await this.request(`clients/${userId}/${clientId}`);
    return res.client;
  }

  /** Get list of Clients */

  static async getClients(userId) {
    let res = await this.request(`clients/${userId}`);
    return res.clients;
  }

  /* Send Email 
      msg = {*/
  static async send(userId, msg) {
    let res = await this.request(`invoices/${userId}/send`, msg, "post");
    return res;
  }
}

export default LobsterApi;
