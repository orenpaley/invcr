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
    const headers = { Authorization: `Bearer ${LobsterApi.token}` };
    const params = method === "get" ? data : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error("API Error:", err.response);
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
    console.log("res", res);
    LobsterApi.token = res.token;
    console.log("log in successful");
    return res.token;
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
    console.log("user patched", res);
    return res;
  }

  // ** Save New Invoice */

  static async saveInvoice(userId, data) {
    let res = await this.request(`invoices/${userId}`, data, "post");
    return res.invoice;
  }

  // Modify existing Invoice
  static async patchInvoice(userId, code, data) {
    let res = await this.request(`invoices/${userId}/${code}`, data, "patch");
    return res.invoice;
  }

  /** Get Invoice. */

  static async getInvoice(userId, code) {
    let res = await this.request(`invoices/${userId}/${code}`);
    return res.invoice;
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

  /** User Apply to Job **/
  static async applyJob(username, jobId) {
    let res = await this.request(`users/${username}/jobs/${jobId}`, {}, "post");
    console.log(`${username} applied to job {${jobId}}`, res);
    return res;
  }
  /** User Un Apply to Job **/
  static async unApplyJob(username, jobId) {
    let res = await this.request(
      `users/${username}/jobs/${jobId}`,
      {},
      "delete"
    );
    console.log(`${username} removed application {${jobId}}`, res);
    return res;
  }
}

// for now, put token ("testuser" / "password" on class)
// JoblyApi.token =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZ" +
//   "SI6InRlc3R1c2VyIiwiaXNBZG1pbiI6ZmFsc2UsImlhdCI6MTU5ODE1OTI1OX0." +
//   "FtrMwBQwe6Ue-glIFgz_Nf8XxRT2YecFCiSpYL0fCXc";

export default LobsterApi;
