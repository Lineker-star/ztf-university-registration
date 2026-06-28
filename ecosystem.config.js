module.exports = {
  apps: [{
    name: 'ztf-registration',
    script: 'node_modules/.bin/next',
    args: 'start',
    cwd: '/home/u161800917/domains/register.ztfuniversity.com/nodejs',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
    },
  }],
}