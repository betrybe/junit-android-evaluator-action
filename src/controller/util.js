require('dotenv').config()
const core = require('@actions/core')

/**
 * Retorna valor da variavel de ambiente.
 * @example getGithubUsernameData()
 */
function getGithubUsernameData() {
	const username = process.env.INPUT_PR_AUTHOR_USERNAME
	if(username) return username
	return core.getInput('pr_author_username', { required: true })
}

/**
 * Retorna valor da variavel de ambiente.
 * @example getGithubRepositoryNameData()
 */
function getGithubRepositoryNameData() {
	const repository = process.env.GITHUB_REPOSITORY
	if(repository) return repository
	return null
}


module.exports = {
	getGithubUsernameData,
	getGithubRepositoryNameData
}

