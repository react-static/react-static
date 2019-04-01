import fs from 'fs-extra'
import chalk from 'chalk'
import path from 'path'
import git from 'git-promise'
import { execSync } from 'child_process'
import inquirer from 'inquirer'
import autoCompletePrompt from 'inquirer-autocomplete-prompt'
import matchSorter from 'match-sorter'
import downloadGitRepo from 'download-git-repo'
import { promisify } from 'util'
//
import { ChalkColor, time, timeEnd } from '../utils'

inquirer.registerPrompt('autocomplete', autoCompletePrompt)

const typeLocal = 'Local Directory...'
const typeGit = 'GIT Repository...'
const typeExample = 'React Static Example'

const templatesDir = path.resolve(__dirname, '../../templates')

const templates = fs
  .readdirSync(templatesDir)
  .filter(d => !d.startsWith('.') && !d.startsWith('README'))

export default (async function create({ name, template, isCLI }) {
  const isYarn = shouldUseYarn()

  console.log('')

  const exampleChoices = [...templates, typeLocal, typeGit]

  let templateType = typeExample

  // prompt if --name argument is not passed from CLI
  // warning: since name will be set as a function by commander by default
  //   unless it's assigned as an argument from the CLI, we can't simply just
  //   check for its existence. if it has not been set by the CLI, we properly
  //   set it to null for later conditional checks.
  if (isCLI && !name) {
    const answers = await inquirer.prompt({
      type: 'input',
      name: 'name',
      message: 'What should we name this project?',
      default: 'my-static-site',
    })
    name = answers.name
  }

  if (!name) {
    throw new Error(
      'A project name is required. Please use options.name to define one.'
    )
  }

  const dest = path.resolve(process.cwd(), name)

  if (fs.existsSync(dest)) {
    throw new Error(
      `Could not create project. Directory already exists at ${dest}!`
    )
  }

  if (isCLI && !template) {
    const answers = await inquirer.prompt({
      type: 'autocomplete',
      name: 'template',
      message: 'Select a template below...',
      source: async (answersSoFar, input) =>
        !input ? exampleChoices : matchSorter(exampleChoices, input),
    })
    template = answers.template
  }

  if (!template) {
    throw new Error(
      'A project template is required. Please use options.template to define one.'
    )
  }

  time(chalk.green(`[\u2713] Project "${name}" created`))
  console.log('Creating new react-static project...')

  if (template === typeLocal) {
    templateType = typeLocal
    const { localDirectory } = await inquirer.prompt([
      {
        type: 'input',
        name: 'localDirectory',
        message: `Enter an local directory's absolute location (~/Desktop/my-template)`,
      },
    ])
    template = localDirectory
  }

  if (template === typeGit) {
    templateType = typeGit
    const { githubRepoName } = await inquirer.prompt([
      {
        type: 'input',
        name: 'githubRepoName',
        message:
          'Enter a repository URL from GitHub, BitBucket, GitLab, or any other public repo. (https://github.com/ownerName/repoName.git)',
      },
    ])
    template = githubRepoName
  }

  console.log('')

  // GIT repositories
  if (templateType === typeGit) {
    if (template.startsWith('https://') || template.startsWith('git@')) {
      try {
        console.log(chalk.green(`Cloning Git template: ${template}`))
        await git(`clone --recursive ${template} ${dest}`)
      } catch (err) {
        console.log(chalk.red(`Cloning Git template: ${template} failed!`))
        throw err
      }
    } else if (template.startsWith('http://')) {
      // use download-git-repo to fetch remote repository
      const getGitHubRepo = promisify(downloadGitRepo)
      try {
        console.log(chalk.green(`Cloning Git template: ${template}`))
        await getGitHubRepo(template, dest)
      } catch (err) {
        console.log(chalk.red(`Cloning Git template: ${template} failed!`))
        throw err
      }
    }
  } else if (templateType === typeExample) {
    // React Static templates
    console.log(chalk.green(`Using React Static template: ${template}`))
    try {
      await fs.copy(
        path.resolve(templatesDir, template),
        path.resolve(process.cwd(), dest)
      )
    } catch (err) {
      console.log(
        chalk.red(`Copying React Static template: ${template} failed!`)
      )
      throw err
    }
  } else {
    // Local templates
    try {
      console.log(chalk.green(`Using template from directory: ${template}`))
      await fs.copy(path.resolve(process.cwd(), template), dest)
    } catch (err) {
      console.log(
        chalk.red(`Copying the template from directory: ${template} failed!`)
      )
      throw err
    }
  }

  // Since npm packaging will clobber .gitignore files
  // We need to rename the gitignore file to .gitignore
  // See: https://github.com/npm/npm/issues/1862

  if (
    !fs.pathExistsSync(path.join(dest, '.gitignore')) &&
    fs.pathExistsSync(path.join(dest, 'gitignore'))
  ) {
    await fs.move(path.join(dest, 'gitignore'), path.join(dest, '.gitignore'))
  }
  if (fs.pathExistsSync(path.join(dest, 'gitignore'))) {
    fs.removeSync(path.join(dest, 'gitignore'))
  }

  if (isCLI) {
    console.log(
      `Installing dependencies with: ${
        isYarn
          ? chalk.hex(ChalkColor.yarn)('Yarn')
          : chalk.hex(ChalkColor.npm)('NPM')
      }...`
    )
    // We install react-static separately to ensure we always have the latest stable release
    execSync(`cd "${name}" && ${isYarn ? 'yarn' : 'npm install'}`)
    console.log('')
  }

  timeEnd(chalk.green(`[\u2713] Project "${name}" created`))

  console.log(`
  ${chalk.green('To get started:')}

    cd "${name}" ${
    !isCLI
      ? `&& ${
          isYarn
            ? chalk.hex(ChalkColor.yarn)('yarn')
            : chalk.hex(ChalkColor.npm)('npm install')
        }`
      : ''
  }

    ${
      isYarn
        ? chalk.hex(ChalkColor.yarn)('yarn')
        : chalk.hex(ChalkColor.npm)('npm run')
    } start ${chalk.green('- Start the development server')}
    ${
      isYarn
        ? chalk.hex(ChalkColor.yarn)('yarn')
        : chalk.hex(ChalkColor.npm)('npm run')
    } build ${chalk.green('- Build for production')}
    ${
      isYarn
        ? chalk.hex(ChalkColor.yarn)('yarn')
        : chalk.hex(ChalkColor.npm)('npm run')
    } serve ${chalk.green('- Test a production build locally')}
  `)
})

function shouldUseYarn() {
  try {
    execSync('yarnpkg --version', { stdio: 'ignore' })
    return true
  } catch (e) {
    return false
  }
}
