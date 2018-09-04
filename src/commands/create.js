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
import { ChalkColor, time, timeEnd } from '../utils'
import {version} from '../../package.json';

inquirer.registerPrompt('autocomplete', autoCompletePrompt)

export default (async function create({ name, template, isCLI } = {}) {
  const prompts = []

  const files = await fs.readdir(path.resolve(__dirname, '../../examples/'))

  console.log('')

  let exampleList = files.filter(d => !d.startsWith('.'))
  exampleList = ['basic', ...exampleList.filter(d => d !== 'basic')]
  const exampleChoices = [...exampleList, 'custom']

  // prompt if --name argument is not passed from CLI
  // warning: since name will be set as a function by commander by default
  //   unless it's assigned as an argument from the CLI, we can't simply just
  //   check for it's existence. if it's not been set by the CLI, we properly
  //   set it to null for later conditional checks.
  if (typeof name !== 'string') {
    name = null
    prompts.push({
      type: 'input',
      name: 'name',
      message: 'What should we name this project?',
      default: 'my-static-site',
    })
  }

  // prompt if --template argument is not passed from CLI
  if (!template) {
    prompts.push({
      type: 'autocomplete',
      name: 'template',
      message: 'Select a template below...',
      source: async (answersSoFar, input) =>
        !input ? exampleChoices : matchSorter(exampleChoices, input),
    })
  }

  const shouldPrompt = isCLI && (!name || !template)
  const answers = shouldPrompt ? await inquirer.prompt(prompts) : {}

  if (answers.name) {
    name = answers.name
  }
  if (answers.template) {
    template = answers.template
  }

  if (!name) {
    throw new Error(
      'A project name is required. Please use options.name to define one.'
    )
  }

  if (!template) {
    throw new Error(
      'A project template is required. Please use options.template to define one.'
    )
  }

  time(chalk.green(`=> [\u2713] Project "${name}" created`))
  console.log('=> Creating new react-static project...')
  const dest = path.resolve(process.cwd(), name)

  if (template === 'custom') {
    const { githubRepoName } = await inquirer.prompt([
      {
        type: 'input',
        name: 'githubRepoName',
        message:
          'Specify the full address of a public git repo from GitHub, BitBucket, GitLab, etc. (https://github.com/ownerName/repoName.git)',
        default: 'basic',
      },
    ])
    template = githubRepoName
  }

  // Fetch template
  await fetchTemplate(template, dest)

  // Since npm packaging will clobber .gitignore files
  // We need to rename the gitignore file to .gitignore
  // See: https://github.com/npm/npm/issues/1862

  if (!fs.pathExistsSync(path.join(dest, '.gitignore'))) {
    await fs.move(path.join(dest, 'gitignore'), path.join(dest, '.gitignore'))
  }
  if (fs.pathExistsSync(path.join(dest, 'gitignore'))) {
    fs.removeSync(path.join(dest, 'gitignore'))
  }

  const isYarn = shouldUseYarn()

  if (isCLI) {
    console.log(
      `=> Installing dependencies with: ${
        isYarn
          ? chalk.hex(ChalkColor.yarn)('Yarn')
          : chalk.hex(ChalkColor.npm)('NPM')
      }...`
    )
    // We install react-static separately to ensure we always have the latest stable release
    execSync(
      `cd ${name} && ${isYarn ? 'yarn' : 'npm install'} && ${
        isYarn
          ? `yarn add react-static@${version}`
          : `npm install react-static@${version} --save`
      }`
    )
    console.log('')
  }

  timeEnd(chalk.green(`=> [\u2713] Project "${name}" created`))

  console.log(`
  ${chalk.green('=> To get started:')}

    cd ${name} ${
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

  async function fetchTemplate(template, dest) {
    console.log('')
    if (template.startsWith('https://') || template.startsWith('git@')) {
      try {
        console.log(chalk.green(`Downloading template: ${template}`))
        await git(`clone --recursive ${template} ${dest}`)
      } catch (err) {
        console.log(chalk.red(`Download of ${template} failed`))
        throw err
      }
    } else if (template.startsWith('http://')) {
      // use download-git-repo to fetch remote repository
      const getGitHubRepo = promisify(downloadGitRepo)
      try {
        console.log(chalk.green(`Downloading template: ${template}`))
        await getGitHubRepo(template, dest)
      } catch (err) {
        console.log(chalk.red(`Download of ${template} failed`))
        throw err
      }
    } else {
      // If it's an exapmle template, copy it from there
      if (exampleList.includes(template)) {
        try {
          console.log(chalk.green(`Using template: ${template}`))
          return fs.copy(
            path.resolve(__dirname, `../../examples/${template}`),
            dest
          )
        } catch (err) {
          console.log(chalk.red(`Copying the template: ${template} failed`))
          throw err
        }
      }
      // template must be local, copy directly
      try {
        console.log(chalk.green(`Using template from directory: ${template}`))
        await fs.copy(path.resolve(__dirname, template), dest)
      } catch (err) {
        console.log(
          chalk.red(`Copying the template from directory: ${template} failed`)
        )
        throw err
      }
    }
  }
})

function shouldUseYarn() {
  try {
    execSync('yarnpkg --version', { stdio: 'ignore' })
    return true
  } catch (e) {
    return false
  }
}
