module.exports = {
  apps: [{
    name: 'ztf-registration',
    script: '.next/standalone/server.js',
    cwd: '/home/u161800917/domains/register.ztfuniversity.com/nodejs',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      HOSTNAME: '0.0.0.0',
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '512M',
  }],
};