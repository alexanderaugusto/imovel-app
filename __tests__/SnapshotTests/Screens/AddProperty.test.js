import React from 'react'
import { act, create } from 'react-test-renderer'
import AddProperty from '../../../src/screens/AddProperty'

jest.useFakeTimers()
jest.mock('@expo/vector-icons', () => {
  return {
    ...jest.requireActual('@expo/vector-icons'),
    FontAwesome5: () => jest.fn()
  }
})
jest.mock('@react-native-community/async-storage', () => 'AsyncStorage')
jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({
      navigate: jest.fn(),
    })
  }
})

describe('AddProperty test', () => {

  it('render AddProperty screen correctly', () => {
    act(() => {
      tree = create(
        <AddProperty />
      )
    })

    expect(tree.toJSON()).toMatchSnapshot();
  })
})