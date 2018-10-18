import fs from 'fs-extra'
import chalk from 'chalk'
import path from 'path'
import git from 'git-promise'
import { execSync, exec } from 'child_process'
import inquirer from 'inquirer'
import autoCompletePrompt from 'inquirer-autocomplete-prompt'
import matchSorter from 'match-sorter'
import downloadGitRepo from 'download-git-repo'
import { promisify } from 'util'
import tarfs from 'tar-fs'
import axios from 'axios'
import gunzip from 'gunzip-maybe'
//
import { ChalkColor, time, timeEnd } from '../utils'
import { version } from '../../package.json'
import exampleList from '../exampleList.json'

inquirer.registerPrompt('autocomplete', autoCompletePrompt)

const typeLocal = 'Local Directory...'
const typeGit = 'GIT Repository...'
const typeNpm = 'NPM package...'
const typeExample = 'React Static Example'
const tempDest = '.temp'

export default (async function create({ name, template, isCLI } = {}) {
  const prompts = []
  console.log('')

  const firstExamples = ['basic', 'blank']
  const npmExamples = [
    ...firstExamples,
    ...exampleList.filter(d => !firstExamples.includes(d)),
  ]
  const exampleChoices = [...npmExamples, typeLocal, typeGit, typeNpm]

  let templateType = typeExample

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

  if (template === typeNpm) {
    templateType = typeNpm
    const { npmRepoName } = await inquirer.prompt([
      {
        type: 'input',
        name: 'npmRepoName',
        message: 'Enter an NPM package name (my-npm-package)',
      },
    ])
    template = npmRepoName
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
  } else if (templateType === typeExample || templateType === typeNpm) {
    // NPM packages
    const prefix = templateType === typeExample ? 'react-static-example-' : ''
    const npmVersion = templateType === typeExample ? version : 'latest'
    const packageName = `${prefix}${template}@${npmVersion}`
    let tarName
    console.log(chalk.green(`Downloading NPM template: ${packageName}`))
    try {
      tarName = (await new Promise((resolve, reject) => {
        exec(
          `${isYarn ? `yarn` : `npm`} pack ${packageName}`,
          (error, stdout, stderr) => {
            if (error) {
              console.log(error)
              reject(stderr)
              return
            }
            console.log(stdout)
            resolve(stdout)
          }
        )
      })).replace(/\n/gm, '')

      // return a promise and resolve when download finishes
      await new Promise((resolve, reject) => {
        // Stream the tarball through gunzip-maybe and then untar it to the destination

        const writeStream = tarfs.extract(path.resolve(process.cwd(), tempDest))

        fs.createReadStream(path.resolve(process.cwd(), tarName))
          .pipe(gunzip())
          .pipe(writeStream)

        writeStream.on('finish', resolve)
        writeStream.on('error', reject)
      })

      try {
        // Move the untarred `package` directory to the root of the destination
        await fs.renameSync(
          path.resolve(process.cwd(), tempDest, 'package'),
          path.resolve(process.cwd(), dest)
        )
      } catch (err) {
        console.log(
          chalk.red(`Directory already exists at ${(process.cwd(), dest)}!`)
        )
        throw err
      }
    } catch (err) {
      console.log(chalk.red(`Downloading NPM template: ${packageName} failed!`))
      throw err
    } finally {
      await fs.remove(path.resolve(process.cwd(), tarName))
      await fs.remove(path.resolve(process.cwd(), tempDest))
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
    execSync(`cd ${name} && ${isYarn ? 'yarn' : 'npm install'}`)
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
})

function shouldUseYarn() {
  try {
    execSync('yarnpkg --version', { stdio: 'ignore' })
    return true
  } catch (e) {
    return false
  }
}
