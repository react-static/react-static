import path from 'path'
import slash from 'slash'
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

test('relative routes path are relative and use the __react_static_root__ alias', async () => {
  const { templates } = await extractTemplates({
    config,
    routes: [{ path: '404', template: './src/templates/NotFound' }],
  })

  expect(templates[0]).toBe('__react_static_root__/src/templates/NotFound')
})

test('absolute routes path are relative and use the __react_static_root__ alias', async () => {
  const { templates } = await extractTemplates({
    config,
    routes: [{ path: '404', template: '/home/src/templates/NotFound' }],
  })

  expect(templates[0]).toBe(
    slash(
      `__react_static_root__/${path.relative(
        config.paths.ROOT,
        '/home/src/templates/NotFound'
      )}`
    )
  )
})
