import { helloWorld } from '../src'

describe('Hello World', () => {
  it('runs with a name', () => {
    expect(helloWorld('Paul')).toEqual(`hello, Paul`)
  })
})
