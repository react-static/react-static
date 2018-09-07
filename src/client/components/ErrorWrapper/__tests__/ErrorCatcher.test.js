import React from 'react'
import { shallow, mount } from 'enzyme'
import ErrorCatcher from '../ErrorCatcher'

describe('ErrorCatcher', () => {
  test('by default should render children', () => {
    const errorCatcher = shallow(
      <ErrorCatcher>
        <span>hello</span>
      </ErrorCatcher>
    )

    expect(errorCatcher).toMatchSnapshot()
  })

  describe('when children throw an error', () => {
    it('should catch errors with componentDidCatch', () => {
      const ChildComponentWithError = () => {
        throw new Error('Error thrown from problem child')
      }

      jest.spyOn(ErrorCatcher.prototype, 'componentDidCatch')

      const errorCatcher = mount(
        <ErrorCatcher>
          <ChildComponentWithError />
        </ErrorCatcher>
      )

      expect(ErrorCatcher.prototype.componentDidCatch).toHaveBeenCalled()
      expect(errorCatcher.state('error')).toEqual(new Error('Error thrown from problem child'))
      expect(errorCatcher.state('errorInfo')).toMatchSnapshot()
      expect(errorCatcher).toMatchSnapshot()
    })
  })
})
