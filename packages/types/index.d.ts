declare module '@qlover/fe-node-lib' {
  export class Dependency extends (await import('../lib/Dependency.js'))
    .Dependency {}
  export class Env extends (await import('../lib/Env.js')).Env {}
  export class Files extends (await import('../lib/Files.js')).Files {}
  export class Logger extends (await import('../lib/Logger.js')).Logger {}
  export class Shell extends (await import('../lib/Shell.js')).Shell {}
}
