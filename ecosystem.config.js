module.exports = {
  apps: [
    {
      name: 'weabur',
      script: 'pnpm',
      args: 'start',
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
