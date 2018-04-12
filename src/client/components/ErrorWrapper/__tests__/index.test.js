import React from 'react'
import { shallow } from 'enzyme'
import ErrorWrapper from '../index'

describe('ErrorWrapper', () => {
  let reactStaticEnviroment

  beforeEach(() => {
    reactStaticEnviroment = process.env.REACT_STATIC_ENV
  })

  describe('when process.env.REACT_STATIC_ENV is `development`', () => {
    it('should wrap the child with the ErrorCatcher', () => {
      process.env.REACT_STATIC_ENV = 'development'

      const errorWrapper = shallow(
        <ErrorWrapper>
          <span>hello</span>
        </ErrorWrapper>
      )

      expect(errorWrapper).toMatchSnapshot()
    })
  })

  describe('when process.env.REACT_STATIC_ENV is `production`', () => {
    it('should not wrap the child with the ErrorCatcher', () => {
      process.env.REACT_STATIC_ENV = 'production'

      const errorWrapper = shallow(
        <ErrorWrapper >
          <span>hello</span>
        </ErrorWrapper>
      )

      expect(errorWrapper).toMatchSnapshot()
    })

    describe('when showErrorsInProduction is defined', () => {
      it('should wrap the child with the ErrorCatcher', () => {
        process.env.REACT_STATIC_ENV = 'production'

        const errorWrapper = shallow(
          <ErrorWrapper showErrorsInProduction>
            <span>hello</span>
          </ErrorWrapper>
        )

        expect(errorWrapper).toMatchSnapshot()
      })
    })
  })

  afterEach(() => {
    process.env.REACT_STATIC_ENV = reactStaticEnviroment
  })
})
