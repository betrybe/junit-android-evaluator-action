require('dotenv').config()
const core = require('@actions/core');

/**
 * Retorna valor da variavel de ambiente.
 * @example getGithubUsernameData(obj)
 */
 function getGithubUsernameData() {
  repository = process.env.INPUT_PR_AUTHOR_USERNAME;
  if(repository) return repository;
  else return core.getInput('pr_author_username', { required: true });
}

/**
 * Retorna valor da variavel de ambiente.
 * @example getGithubRepositoryNameData()
 */
function getGithubRepositoryNameData() {
  repository = process.env.GITHUB_REPOSITORY;
  if(repository) return repository;
  else return null;
}


module.exports = {
  getGithubUsernameData,
  getGithubRepositoryNameData
}

