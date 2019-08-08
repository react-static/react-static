import extractTemplates from '../extractTemplates'

const config = {
  paths: {
    ROOT: process.cwd(),
  },
}

test('a 404 route is required when the build is not incremental', async () => {
  expect.assertions(1)
  try {
    await extractTemplates({
      config,
      routes: [],
      incremental: false,
    })
  } catch (error) {
    expect(error.message).toBeTruthy()
  }
})

test('a 404 route is not required when the build is incremental', async () => {
  expect.assertions(1)
  try {
    const state = await extractTemplates({
      config,
      routes: [],
      incremental: true,
    })
    expect(state).toBeTruthy()
  } catch (_error) {
    throw new Error()
  }
})

test('the 404 template is the first one', async () => {
  const state = await extractTemplates({
    config,
    routes: [
      { path: '/', template: './src/templates/Homepage' },
      { path: '404', template: './src/templates/404' },
    ],
  })

  expect(state.templates[0]).toContain('src/templates/404')
})
