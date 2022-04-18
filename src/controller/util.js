require('dotenv').config()
const core = require('@actions/core');

/**
 * Retorna valor da variavel de ambiente.
 * @example getGithubUsernameData()
 */
 function getGithubUsernameData() {
  username = core.getInput('pr_author_username', { required: true });
  core.info(`\u001b[38;5;6m[info] ⚙️ pr_author_username: ${username}`);
  if(username) return username;
  return process.env.INPUT_PR_AUTHOR_USERNAME;
}

/**
 * Retorna valor da variavel de ambiente.
 * @example getGithubRepositoryNameData()
 */
function getGithubRepositoryNameData() {
  repository = process.env.GITHUB_REPOSITORY;
  if(repository) return repository;
  return null;
}


module.exports = {
  getGithubUsernameData,
  getGithubRepositoryNameData
}

