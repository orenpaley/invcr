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

  static async register(email, password, firstName, lastName, email) {
    let res = await this.request(
      "auth/register",
      {
        username: username,
        password: password,
        firstName: firstName,
        lastName: lastName,
        email: email,
      },
      "post"
    );
    return res.token;
  }

  static async getUser(username) {
    let res = await this.request(`users/${username}`);
    return res.user;
  }

  static async patchUser(username, data) {
    let res = await this.request(`users/${username}`, data, "patch");
    console.log("user patched", res);
    return res;
  }

  /** Get details on a company by handle. */

  static async getCompany(handle) {
    let res = await this.request(`companies/${handle}`);
    return res.company;
  }

  /** Get list of companies */

  static async getCompanies(filterer = null) {
    let res = await this.request(`companies`);
    return !filterer
      ? res.companies
      : res.companies.filter((c) => c.handle.includes(filterer));
  }

  /** Get details on a job */

  static async getJob(id) {
    let res = await this.request(`jobs/${id}`);
    return res.job;
  }

  /** Get list of jobs */

  static async getJobs() {
    let res = await this.request(`jobs`);
    return res.jobs;
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

export default JoblyApi;
