import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

/** API Class.
 *
 * Static class tying together methods used to get/send to the API.

 *
 */

class LobsterApi {
  // the token for interacting with the API will be stored here.
  static token;

  static async request(endpoint, data = {}, method = "get") {
    const url = `${BASE_URL}/${endpoint}`;
    const headers = {
      Authorization: `Bearer ${LobsterApi.token}`,
    };
    const params = method === "get" ? data : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      // console.error("API Error:", err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

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

    LobsterApi.token = res.user.token;

    localStorage.setItem("curr", JSON.stringify(res.user));

    return { token: res.token, user: res.user };
  }
  // ******** REGISTER
  static async register(email, password, name, address) {
    let res = await this.request(
      "auth/register",
      {
        email: email,
        password: password,
        name: name,
        address: address,
      },
      "post"
    );
    LobsterApi.token = res.token;
    localStorage.setItem("token", res.token);
    localStorage.setItem("user", res.user);
    return res.token;
  }

  static async getUser(id) {
    let res = await this.request(`users/${id}`);
    return res.user;
  }

  static async patchUser(userId, data) {
    let res = await this.request(`users/${userId}`, data, "patch");

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
    return { deleted: res.invoice };
  }

  /** Get list of invoices */

  static async getInvoices(userId) {
    let res = await this.request(`invoices/${userId}`);

    return res.invoices;
  }

  /** add new Client */
  static async addClient(id, data) {
    let res = await this.request(`clients/${id}`, data, "post");
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

  static async deleteClient(userId, clientId) {
    let res = await this.request(`clients/${userId}/${clientId}`, {}, "delete");
    return res.client;
  }

  /** Get list of Clients */

  static async getClients(userId) {
    let res = await this.request(`clients/${userId}`);
    return res.clients;
  }

  /* Send Email 
      msg = {*/
  static async send(userId, invoiceId, msg) {
    let res = await this.request(
      `invoices/${userId}/${invoiceId}/send`,
      msg,
      "post"
    );
    return res;
  }

  static async send(userId, invoiceId, msg) {
    let res = await this.request(
      `invoices/${userId}/${invoiceId}/send`,
      msg,
      "post"
    );
    return res;
  }
}

export default LobsterApi;
