module.exports = {
  apps: [
    {
      name: 'ztf-registration',
      script: 'server.js',
      cwd: '/home/u161800917/domains/register.ztfuniversity.com/public_html',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
}