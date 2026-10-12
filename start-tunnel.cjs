const localtunnel = require('localtunnel');

async function createTunnel() {
  const desiredSubdomain = 'ecocycle-pune-' + Math.floor(100 + Math.random() * 900);
  try {
    const tunnel = await localtunnel({
      port: 5173,
      subdomain: desiredSubdomain
    });

    console.log('\n======================================================');
    console.log('  ECOCYCLE PUBLIC REMOTE URL:');
    console.log('  ' + tunnel.url);
    console.log('======================================================\n');

    tunnel.on('close', () => {
      console.log('Tunnel connection closed. Reconnecting in 3 seconds...');
      setTimeout(createTunnel, 3000);
    });

    tunnel.on('error', (err) => {
      console.error('Tunnel error:', err.message);
      tunnel.close();
    });
  } catch (err) {
    console.error('Failed to establish tunnel:', err.message);
    setTimeout(createTunnel, 4000);
  }
}

createTunnel();
