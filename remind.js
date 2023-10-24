import { Octokit } from "octokit";
import { config } from "dotenv";

config();

if (!process.env.GITHUB_TOKEN) {
  throw new Error("GITHUB_TOKEN is not set");
}

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

// get all collaborators of Frank-Mayer/how-to-science
const collaborators = await octokit.paginate(
  "GET /repos/{owner}/{repo}/collaborators",
  {
    owner: "Frank-Mayer",
    repo: "how-to-science",
  },
);

// create a string of all collaborators to mention them in the comment
const collab = collaborators.map((c) => `@${c.login}`).join(" ");

// find all open issues in Frank-Mayer/how-to-science
const issues = await octokit.paginate("GET /repos/{owner}/{repo}/issues", {
  owner: "Frank-Mayer",
  repo: "how-to-science",
  state: "open",
});

// loop over all issues
for (const issue of issues) {
  // add a comment to the issue to remind the collaborators
  console.log(`Adding comment to issue #${issue.number}`);
  await octokit.request(
    "POST /repos/{owner}/{repo}/issues/{issue_number}/comments",
    {
      owner: "Frank-Mayer",
      repo: "how-to-science",
      issue_number: issue.number,
      body: `This issue is still open. Please have a look at it. ${collab}`,
    },
  );
}
