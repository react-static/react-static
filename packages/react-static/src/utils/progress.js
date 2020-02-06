import Progress from 'progress'

export default (total, label, options) => {
  if (!options) {
    options = {}
  }
  if (!options.format) {
    options.format = `${
      label ? `${label} ` : ''
    }[:bar] :current/:total :percent :rate/s :etas `
  }
  const stream = options.stream || process.stdout
  if (stream.isTTY && !options.forceNonTTY) {
    options.total = total
    return new Progress(options.format, options)
  }
  let curr = 0
  let percent = 0
  const start = new Date()
  return {
    tick: () => {
      curr += 1
      const ratio = Math.min(Math.max(curr / total, 0), 1)
      const value = Math.floor(ratio * 100)

      if (value >= percent + 5) {
        percent = value
        const elapsed = new Date() - start
        const eta = percent === 100 ? 0 : elapsed * (total / curr - 1)
        const rate = curr / (elapsed / 1000)
        stream.write(
          `${options.format
            .replace('[:bar] ', '')
            .replace('[:bar]', '')
            .replace(':current', curr)
            .replace(':total', total)
            .replace(
              ':elapsed',
              Number.isNaN(elapsed) ? '0.0' : (elapsed / 1000).toFixed(1)
            )
            .replace(
              ':eta',
              Number.isNaN(eta) || !Number.isFinite(eta)
                ? '0.0'
                : (eta / 1000).toFixed(1)
            )
            .replace(':percent', `${percent.toFixed(0)}%`)
            .replace(':rate', Math.round(rate))}\n`
        )
      }
    },
  }
}
