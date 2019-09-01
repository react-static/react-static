import 'raf/polyfill'

/* eslint import/no-extraneous-dependencies: ["error", {"optionalDependencies": false}] */
const Enzyme = require('enzyme')
const EnzymeAdapter = require('enzyme-adapter-react-16')

// Setup enzyme's react adapter
Enzyme.configure({ adapter: new EnzymeAdapter() })
