import React from 'react'
import { create } from 'react-test-renderer'
import { ImagePickerFunction } from '../../../src/components'

jest.runAllTimers()

describe('ImagePicker snapshot test', () => {
  it('render ImagePicker component correctly', () => {
    const tree = create(<ImagePickerFunction></ImagePickerFunction>)
    expect(tree.toJSON()).toMatchSnapshot()
  })
})
