# Contributing

Below are the rules of contribution! They're here to keep the library running smoothly, protect contributors, and respect everyone's time as an open source developer :)

### Use the community
If you plan on contributing to React-Static in any way, we suggest you [click here to sign up for the React-Tools slack organization](https://react-chat-signup.herokuapp.com). The community is your greatest tool when building new features or fixing bugs :)

### Claim Issues
If you are fixing an issue or bug, please take ownership on it. Too often do multiple devs attempt to fix the same issue at the same time! By claiming it and **stating your estimated timeline** you help triage expectations around the board!

### Open an RFP or discussion for new features. (Requests for Proposals)
If you have an idea for a new feature or optimization, discuss it in an issue or slack thread before coding into the night! It could very well end up that the feature or problem is being solved in another area or that your solution needs some more work to fit into the overal architecture.

## Suggested Dev Environment
- Yarn
- Prettier
- Latest LTS release of Node

## Setup

**In `react-static`:**
1. Install dependencies by running `yarn`
2. Run the development watcher with `yarn watch`. This will watch all files for changes and build automatically to `lib`
3. Link react-static globally using `yarn link`. This will make it available on your machine to other projects.
4. Make your changes

**Testing in an example or personal project:**
1. Install all dependencies by running `yarn`
2. Link the project's `react-static` dependency to your linked repo one by running `yarn link react-static`.
3. Run `react-static` in your project **via node_modules (not the global cli)**. All examples should have a `yarn start` command that does this for you. This is to ensure the cli is using the linked dependency and not the global CLI (which for now is not linkable via yarn)
4. Make your changes

## Testing
Unfortunately, there are no official tests for React-Static yet. If you would like to write the, please do! Now is a great time as the library is very stable. Since we do not have any unit or integration tests in place, please take great care to test your changes on as many examples as possible, including your own in production if necessary. 
